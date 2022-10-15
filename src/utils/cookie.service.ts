import { CookieSerializeOptions } from '@fastify/cookie'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import ms = require('ms')

@Injectable()
export class CookieService {
	constructor(private readonly configService: ConfigService) {}

	dateFromDateInFuture(date: Date, duration: string) {
		return new Date(date.getTime() + ms(duration))
	}
	dateFromNowInFuture(duration: string) {
		return this.dateFromDateInFuture(new Date(), duration)
	}

	getAccessTokenCookieOptions(): {
		accessTokenCookieName: string
		accessTokenCookieOptions: CookieSerializeOptions
	} {
		return {
			accessTokenCookieName: this.configService.get<string>('JWT_ACCESS_TOKEN_COOKIE_NAME'),
			accessTokenCookieOptions: {
				httpOnly: true,
				expires: this.dateFromNowInFuture('15m'),
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
				expires: this.dateFromNowInFuture('30d'),
				domain: this.configService.get<string>('COOKIE_DOMAIN'),
				path: '/',
				secure: false,
				sameSite: 'lax',
			},
		}
	}
}
