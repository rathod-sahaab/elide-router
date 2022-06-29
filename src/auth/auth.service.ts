import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/entities/user.entity'
import { CryptoService } from 'src/services/crypto.service'
import { RefreshTokenService } from 'src/services/data/refresh-token.service'
import { UserService } from 'src/services/data/user.service'
import { RefreshTokenPayload, TokenPayload } from './interfaces/token-payload'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly refreshTokenService: RefreshTokenService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService,
	) {}

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.user({ email })

		if (user && (await this.cryptoService.verifyPassword(password, user.passwordHash))) {
			return new UserEntity(user)
		}

		return null
	}

	async login(user: { email: string; id: number }): Promise<{ accessToken: string }> {
		const payload = { email: user.email, sub: user.id }
		return {
			accessToken: this.jwtService.sign(payload),
		}
	}

	async validateToken(token: string): Promise<boolean> {
		try {
			const user = (await this.jwtService.verify(token)) as TokenPayload
			if (!user) {
				return false
			}
			return true
		} catch {
			return false
		}
	}

	async validateRefreshToken(token: string): Promise<RefreshTokenPayload> {
		const payload = this.cryptoService.verifyRefreshToken(token)
		if (!payload) {
			throw new UnauthorizedException('Invalid refresh token.')
		}

		const refreshToken = await this.refreshTokenService.refreshToken({ id: payload.tokenId })

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

	// TODO: remove this after class-validator is fixed
	async test_get_user(email: string): Promise<UserEntity> {
		const user = await this.usersService.user({ email })
		if (!user) {
			throw new NotFoundException('User with given email not found.')
		}
		return new UserEntity(user)
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
		const user = await this.usersService.user({ email })

		if (user) {
			throw new ForbiddenException('Email already in use.')
		}

		const passwordHash = await this.cryptoService.hashPassword(password)

		return new UserEntity(
			await this.usersService.createUser({
				email,
				name,
				passwordHash,
			}),
		)
	}
}
