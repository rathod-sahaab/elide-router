import { CookieSerializeOptions } from '@fastify/cookie'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import ms = require('ms')

const dateInFuture = (duration: string) => new Date(Date.now() + ms(duration))

@Injectable()
export class CookieService {
	constructor(private readonly configService: ConfigService) {}

	getAccessTokenCookieOptions(): {
		accessTokenCookieName: string
		accessTokenCookieOptions: CookieSerializeOptions
	} {
		return {
			accessTokenCookieName: this.configService.get<string>('JWT_ACCESS_TOKEN_COOKIE_NAME'),
			accessTokenCookieOptions: {
				httpOnly: true,
				expires: dateInFuture('15m'),
				domain: this.configService.get<string>('COOKIE_DOMAIN'),
				path: '/',
				secure: false,
				sameSite: 'lax',
			},
		}
	}

	getRefreshTokenCookieOptions(): {
		refreshTokenCookieName: string
		refreshTokenCookieOptions: CookieSerializeOptions
	} {
		return {
			refreshTokenCookieName: this.configService.get<string>('JWT_REFRESH_TOKEN_COOKIE_NAME'),
			refreshTokenCookieOptions: {
				httpOnly: true,
				expires: dateInFuture('30d'),
				domain: this.configService.get<string>('COOKIE_DOMAIN'),
				path: '/',
				secure: false,
				sameSite: 'lax',
			},
		}
	}
}
