import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshToken } from '@prisma/client'
import { UserEntity } from 'src/data/entities/user.entity'
import { CryptoService } from 'src/utils/crypto.service'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'
import { UserRepository } from 'src/data/repositories/user.repository'
import { RefreshTokenPayload, TokenPayload } from '../../commons/types/token-payload'

@Injectable()
export class AuthService {
	constructor(
		private readonly cryptoService: CryptoService,
		private readonly jwtService: JwtService,
		private readonly refreshRepository: RefreshTokenRepository,
		private readonly userRepository: UserRepository,
	) {}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.userRepository.user({ email })

		if (user && (await this.cryptoService.verifyPassword(password, user.passwordHash))) {
			return new UserEntity(user)
		}

		return null
	}

	async login(user: {
		email: string
		id: number
	}): Promise<{ accessToken: string; refreshToken: string }> {
		const accessTokenPayload: TokenPayload = { email: user.email, sub: user.id }
		const refreshTokenDB = await this.refreshRepository.createRefreshToken({
			user: { connect: { id: user.id } },
		})

		const refreshTokenPayload: RefreshTokenPayload = {
			tokenId: refreshTokenDB.id,
			accessTokenPayload,
		}
		return {
			accessToken: this.jwtService.sign(accessTokenPayload),
			refreshToken: this.cryptoService.signRefreshToken(refreshTokenPayload),
		}
	}

	async validateToken(token: string): Promise<boolean> {
		try {
			const user = (await this.jwtService.verify(token)) as TokenPayload
			if (!user) {
				return false
			}
			return true
		} catch (err) {
			return false
		}
	}

	async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
		const payload = this.cryptoService.verifyRefreshToken(token)
		if (!payload) {
			throw new UnauthorizedException('Invalid refresh token.')
		}

		const refreshToken = await this.refreshRepository.refreshToken({ id: payload.tokenId })

		if (!refreshToken || !refreshToken.isActive) {
			throw new UnauthorizedException('Invalid refresh token.')
		}

		return payload
	}

	async createTokens(
		oldRefreshTokenPayload: RefreshTokenPayload,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const accessTokenPayload: TokenPayload = oldRefreshTokenPayload.accessTokenPayload
		const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: '1h' })

		const refreshTokenPayload: RefreshTokenPayload = {
			tokenId: oldRefreshTokenPayload.tokenId,
			accessTokenPayload,
		}

		const refreshToken = this.cryptoService.signRefreshToken(refreshTokenPayload)

		return { accessToken, refreshToken }
	}

	deleteRefreshToken(token: string): Promise<RefreshToken> {
		// ignoring expiration because we are deleting it anyway
		const payload = this.cryptoService.verifyRefreshToken(token, false)
		return this.refreshRepository.deleteRefreshToken({ id: payload.tokenId })
	}

	async register({
		email,
		name,
		password,
	}: {
		email: string
		name: string
		password: string
	}): Promise<UserEntity> {
		const user = await this.userRepository.user({ email })

		if (user) {
			throw new ForbiddenException('Email already in use.')
		}

		const passwordHash = await this.cryptoService.hashPassword(password)

		return new UserEntity(
			await this.userRepository.createUser({
				email,
				name,
				passwordHash,
			}),
		)
	}

	async getUserSessions({ userId }: { userId: number }) {
		return this.refreshRepository.getUserRefreshTokens({ userId })
	}

	async deleteSessions({ userId, password }: { userId: number; password: string }) {
		const user = await this.userRepository.user({ id: userId })

		if (!this.cryptoService.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Invalid password')
		}

		await this.refreshRepository.deleteRefreshTokens({ userId })

		return {
			message: 'Sessions deleted successfully',
		}
	}

	async deleteSession({
		userId,
		password,
		sessionId,
	}: {
		userId: number
		password: string
		sessionId: string
	}) {
		const user = await this.userRepository.user({ id: userId })

		if (!this.cryptoService.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Invalid password')
		}

		const token = await this.refreshRepository.refreshToken({ id: sessionId })

		if (!token || token.userId !== userId) {
			throw new UnauthorizedException('Invalid session')
		}

		await this.refreshRepository.deleteRefreshToken({ id: sessionId })

		return {
			message: 'Session deleted successfully',
		}
	}
}
