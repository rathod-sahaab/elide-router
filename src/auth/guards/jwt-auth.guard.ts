import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from 'src/utils/constants'
import { AuthService } from '../auth.service'
import { FastifyReply, FastifyRequest } from '../interfaces/fastify'

export const cookieExtractorCreator = (accessTokenCookieName: string) => {
	return (request: FastifyRequest): string | null => {
		if (request && request.cookies) {
			return request.cookies[accessTokenCookieName]
		}
		return null
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly authService: AuthService,
	) {
		super()
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest() as FastifyRequest
		const response = context.switchToHttp().getResponse() as FastifyReply

		const accessTokenCookieName = this.configService.get<string>('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get<string>('JWT_REFRESH_TOKEN_COOKIE_NAME')

		try {
			const accessToken = request?.cookies[accessTokenCookieName] ?? null

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

			// overwrite current cookie to not fail later
			request.cookies[accessTokenCookieName] = newAccessToken
			request.cookies[refreshTokenCookieName] = newRefreshToken

			response.cookie(accessTokenCookieName, newAccessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
			response.cookie(refreshTokenCookieName, newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)

			return this.activate(context)
		} catch (err) {
			response.clearCookie(accessTokenCookieName)
			response.clearCookie(refreshTokenCookieName)
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
