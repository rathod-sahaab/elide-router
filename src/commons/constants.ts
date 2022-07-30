import { CookieSerializeOptions } from '@fastify/cookie'

const ms = require('ms')
import * as Joi from 'joi'

const dateInFuture = (duration: string) => new Date(Date.now() + ms(duration))

export const getAccessTokenCookieOptions = (): CookieSerializeOptions => ({
	httpOnly: true,
	expires: dateInFuture('15m'),
	path: '/',
	secure: false,
	sameSite: 'lax',
})

export const getRefreshTokenCookieOptions = (): CookieSerializeOptions => ({
	httpOnly: true,
	expires: dateInFuture('7d'),
	path: '/',
	secure: false,
	sameSite: 'lax',
})

export const CONFIG_VALIDATION_SCHEMA = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_VALIDITY: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_VALIDITY: Joi.string().required(),
})
