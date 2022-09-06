import { CookieSerializeOptions } from '@fastify/cookie'

import ms = require('ms')
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
	NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
	PORT: Joi.number().required(),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_VALIDITY: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_VALIDITY: Joi.string().required(),
	VISITOR_ID_COOKIE_NAME: Joi.string().required(),
	MONGO_URI: Joi.string().required(),
})

export const SLUG_REGEX = /^[a-zA-Z0-9\-\_]{1,30}$/
