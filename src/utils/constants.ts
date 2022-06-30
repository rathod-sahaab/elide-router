import { CookieSerializeOptions } from '@fastify/cookie'
import ms from 'ms'

const dateInFuture = (duration: string) => new Date(Date.now() + ms(duration))

export const ACCESS_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	expires: dateInFuture('15s'),
}

export const REFRESH_TOKEN_COOKIE_OPTIONS: CookieSerializeOptions = {
	httpOnly: true,
	expires: dateInFuture('7d'),
}
