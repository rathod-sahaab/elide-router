import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { ExtractJwt, JwtFromRequestFunction } from 'passport-jwt'
import { CryptoService } from 'src/services/crypto.service'
import { UserService } from 'src/services/data/user.service'
import { AuthService } from '../auth.service'

const cookieExtractorCreator = (accessTokenCookieName: string): JwtFromRequestFunction => {
	return (request: any): string | null => {
		let token = null
		if (request && request.cookies) {
			token = request.cookies[accessTokenCookieName]
		}
		return token
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {
		super()
	}

	async canValidate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest()
		const response = context.switchToHttp().getResponse()

		const accessTokenCookieName = this.configService.get<string>('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get<string>('JWT_REFRESH_TOKEN_COOKIE_NAME')

		try {
			const accessToken = ExtractJwt.fromExtractors([
				cookieExtractorCreator(accessTokenCookieName),
			])(request)

			if (!accessToken) {
				throw new UnauthorizedException('Access token absent')
			}

			const isValidAccessToken = await this.authService.validateToken(accessToken)
			if (isValidAccessToken) {
				return this.activate(context)
			}

			const refreshToken = request.cookies[refreshTokenCookieName]
			if (!refreshToken) {
				throw new UnauthorizedException('Refresh token absent')
			}
			const refreshTokenPayload = await this.authService.validateRefreshToken(refreshToken)

			const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
				await this.authService.createTokens(refreshTokenPayload)

			// ovewrite current cookie to not fail later
			request.cookies[accessTokenCookieName] = newAccessToken
			request.cookies[refreshTokenCookieName] = newRefreshToken

			response.cookie(accessTokenCookieName, newAccessToken, {})
			response.cookie(refreshTokenCookieName, newRefreshToken, {})

			return this.activate(context)
		} catch (err) {
			response.clearCookie(accessTokenCookieName, {})
			response.clearCookie(refreshTokenCookieName, {})
			return false
		}
	}

	async activate(context: ExecutionContext): Promise<boolean> {
		return super.canActivate(context) as Promise<boolean>
	}

	handleRequest(err: any, user: any) {
		if (err || !user) {
			throw new UnauthorizedException()
		}

		return user
	}
}
