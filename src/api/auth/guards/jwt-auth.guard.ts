import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { FastifyReply } from 'fastify'
import { CookieService } from 'src/utils/cookie.service'
@Injectable()
export class JwtAuthGuard extends AuthGuard('ACCESS') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('REFRESH') {
	constructor(private readonly cookieService: CookieService) {
		super()
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: any): TUser {
		if (err || !user) {
			const res = context.switchToHttp().getResponse() as FastifyReply

			const { accessTokenCookieName, accessTokenCookieOptions } =
				this.cookieService.getAccessTokenCookieOptions()
			const { refreshTokenCookieName, refreshTokenCookieOptions } =
				this.cookieService.getRefreshTokenCookieOptions()

			res.clearCookie(accessTokenCookieName, accessTokenCookieOptions)
			res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions)

			throw new UnauthorizedException('[RefreshAuthGuard] Invalid refresh token')
		}

		return user
	}
}
