import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { RefreshToken } from '@prisma/client'
import { UserEntity } from 'src/data/entities/user.entity'
import { CryptoService } from 'src/utils/crypto.service'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'
import { UserRepository } from 'src/data/repositories/user.repository'
import { RefreshTokenPayload, TokenPayload } from '../../commons/types/token-payload'
import { ElideMailService } from 'src/utils/mail.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
	constructor(
		private readonly cryptoService: CryptoService,
		private readonly jwtService: JwtService,
		private readonly refreshRepository: RefreshTokenRepository,
		private readonly userRepository: UserRepository,

		private readonly mailService: ElideMailService,
		private readonly configService: ConfigService,
	) {}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.userRepository.user({ email })

		if (user && (await this.cryptoService.verifyPassword(password, user.passwordHash))) {
			return new UserEntity(user)
		}

		return null
	}

	async login({
		email,
		id,
	}: {
		email: string
		id: number
	}): Promise<{ accessToken: string; refreshToken: string; user: UserEntity }> {
		const refreshTokenDB = await this.refreshRepository.createRefreshToken({
			user: { connect: { id } },
		})

		const user = await this.userRepository.user({ id })

		const accessTokenPayload: TokenPayload = { email, sub: id, verified: user.verified }
		const refreshTokenPayload: RefreshTokenPayload = {
			tokenId: refreshTokenDB.id,
			sub: user.id,
			accessTokenPayload,
		}

		return {
			accessToken: this.jwtService.sign(accessTokenPayload),
			refreshToken: this.cryptoService.signRefreshToken(refreshTokenPayload),
			user: new UserEntity(user),
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
			throw new UnauthorizedException('[validateRefreshToken] Invalid refresh token.')
		}

		const refreshToken = await this.refreshRepository.refreshToken({ id: payload.tokenId })

		if (!refreshToken || !refreshToken.isActive) {
			throw new UnauthorizedException('[validateRefreshToken] Expired refresh token')
		}

		return payload
	}

	async createTokens(
		oldRefreshTokenPayload: RefreshTokenPayload,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const accessTokenPayload: TokenPayload = oldRefreshTokenPayload.accessTokenPayload
		const accessToken = this.jwtService.sign(accessTokenPayload, { expiresIn: '1h' })

		const refreshTokenPayload: RefreshTokenPayload = {
			// oldRefreshTokenPayload has other JWT properties so spread operator will cause problems
			sub: oldRefreshTokenPayload.sub,
			tokenId: oldRefreshTokenPayload.tokenId,
			accessTokenPayload,
		}

		const refreshToken = this.cryptoService.signRefreshToken(refreshTokenPayload)

		return { accessToken, refreshToken }
	}

	async refresh({ refreshTokenCookie }: { refreshTokenCookie: string }) {
		const oldTokenPayload = await this.validateRefreshToken(refreshTokenCookie)

		const user = await this.userRepository.user({ id: oldTokenPayload.accessTokenPayload.sub })

		// update accessToken data
		const { accessToken, refreshToken } = await this.createTokens({
			...oldTokenPayload,
			accessTokenPayload: {
				sub: user.id,
				email: user.email,
				verified: user.verified,
			},
		})

		return { accessToken, refreshToken, user: new UserEntity(user) }
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

	async forgotPassword({ email }: { email: string }) {
		const user = await this.userRepository.user({ email })

		if (user) {
			const token = this.cryptoService.signForgotPasswordToken({ sub: user.id, email })

			const FRONTEND_URL = this.configService.get('FRONTEND_URL')

			const resetPasswordLink = `${FRONTEND_URL}/account/reset-password?token=${token}`

			await this.mailService.sendForgotPasswordEmail({
				email,
				data: {
					name: user.name,
					resetPasswordLink,
				},
			})
		}

		return {
			message: 'Email sent successfully',
		}
	}

	async resetPassword({
		token,
		password,
	}: {
		token: string
		password: string
	}): Promise<UserEntity> {
		const payload = this.cryptoService.verifyForgotPasswordToken(token)

		if (!payload) {
			throw new UnauthorizedException('Invalid token')
		}

		const user = await this.userRepository.user({ email: payload.email })

		if (!user) {
			throw new UnauthorizedException('Invalid token')
		}

		const passwordHash = await this.cryptoService.hashPassword(password)

		return new UserEntity(
			await this.userRepository.updateUser(
				{
					id: user.id,
				},
				{
					passwordHash,
				},
			),
		)
	}

	async verifyAccount(token: string) {
		const payload = this.cryptoService.verifyEmailConfirmationToken(token)

		if (!payload) {
			throw new BadRequestException('Link invalid or expired, generate a new link from profile.')
		}

		return this.userRepository.makeUserVerified({ userId: payload.sub })
	}
}
