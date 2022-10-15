import { ConfigService } from '@nestjs/config'
import { CookieService } from './cookie.service'

describe('CookieService', () => {
	let cookieService: CookieService
	let configService: ConfigService

	const mockConfigGet = (key: string) => {
		if (key === 'JWT_ACCESS_TOKEN_COOKIE_NAME') return 'access-token'
		if (key === 'JWT_REFRESH_TOKEN_COOKIE_NAME') return 'refresh-token'
		if (key === 'COOKIE_DOMAIN') return 'localhost'
		return null
	}

	beforeEach(() => {
		configService = new ConfigService()
		cookieService = new CookieService(configService)
	})

	describe('dateFromDateInFuture', () => {
		const date = new Date()
		it('should return true if date is in future', () => {
			expect(cookieService.dateFromDateInFuture(date, '30d')).toEqual(
				new Date(date.getTime() + 30 * 86400 * 1000),
			)
		})
		it('should return false if date is in past', () => {
			expect(cookieService.dateFromDateInFuture(date, '10s')).toEqual(
				new Date(date.getTime() + 10 * 1000),
			)
		})
	})

	describe('getAccessTokenCookieOptions', () => {
		it('should return the access token cookie options', () => {
			jest.spyOn(configService, 'get').mockImplementation(mockConfigGet)

			const {
				accessTokenCookieName,
				accessTokenCookieOptions: { expires, ...accessTokenCookieOptions },
			} = cookieService.getAccessTokenCookieOptions()

			expect({ accessTokenCookieName, accessTokenCookieOptions }).toEqual({
				accessTokenCookieName: 'access-token',
				accessTokenCookieOptions: {
					httpOnly: true,
					domain: 'localhost',
					path: '/',
					secure: false,
					sameSite: 'lax',
				},
			})
		})
		it('should call dateFromNowInFuture with the correctly', () => {
			const spiedDateFromNowInFuture = jest.spyOn(cookieService, 'dateFromNowInFuture')
			cookieService.getAccessTokenCookieOptions()
			expect(spiedDateFromNowInFuture).toBeCalledWith('15m')
			expect(spiedDateFromNowInFuture).toHaveBeenCalledTimes(1)
		})
	})
	describe('getRefreshTokenCookieOptions', () => {
		it('should return the refresh token cookie options', () => {
			jest.spyOn(configService, 'get').mockImplementation(mockConfigGet)

			const {
				refreshTokenCookieName,
				refreshTokenCookieOptions: { expires, ...refreshTokenCookieOptions },
			} = cookieService.getRefreshTokenCookieOptions()

			expect({ refreshTokenCookieName, refreshTokenCookieOptions }).toEqual({
				refreshTokenCookieName: 'refresh-token',
				refreshTokenCookieOptions: {
					httpOnly: true,
					domain: 'localhost',
					path: '/',
					secure: false,
					sameSite: 'lax',
				},
			})
		})
		it('should call dateFromNowInFuture with the correctly', () => {
			const spiedDateFromNowInFuture = jest.spyOn(cookieService, 'dateFromNowInFuture')
			cookieService.getRefreshTokenCookieOptions()
			expect(spiedDateFromNowInFuture).toBeCalledWith('30d')
			expect(spiedDateFromNowInFuture).toHaveBeenCalledTimes(1)
		})
	})
})
