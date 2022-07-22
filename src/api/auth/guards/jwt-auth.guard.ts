import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'
import { FastifyReply } from 'fastify'
import { getAccessTokenCookieOptions } from 'src/commons/constants'
import { FastifyRequest } from '../../../commons/types/fastify'

export const cookieExtractorCreator = (accessTokenCookieName: string) => {
	return (request: FastifyRequest): string | null => {
		if (request && request.cookies) {
			return request.cookies[accessTokenCookieName]
		}
		return null
	}
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('ACCESS') {}

@Injectable()
export class RefreshAuthGuard extends AuthGuard('REFRESH') {
	constructor(private readonly configService: ConfigService) {
		super()
	}

	handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): TUser {
		if (err || !user) {
			const res = context.switchToHttp().getResponse() as FastifyReply

			const accessTokenCookieName = this.configService.get<string>(
				'JWT_ACCESS_TOKEN_COOKIE_NAME',
			)
			const refreshTokenCookieName = this.configService.get<string>(
				'JWT_REFRESH_TOKEN_COOKIE_NAME',
			)

			res.clearCookie(accessTokenCookieName, getAccessTokenCookieOptions())
			res.clearCookie(refreshTokenCookieName, getAccessTokenCookieOptions())

			throw new UnauthorizedException('[RefreshAuthGuard] Invalid refresh token')
		}
		return user
	}
}
