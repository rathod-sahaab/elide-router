import * as Joi from 'joi'

export const CONFIG_VALIDATION_SCHEMA = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
	PORT: Joi.number().required(),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_VALIDITY: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_VALIDITY: Joi.string().required(),
	COOKIE_DOMAIN: Joi.string().required(),
	VISITOR_ID_COOKIE_NAME: Joi.string().required(),
	MONGO_URI: Joi.string().required(),
})

export const SLUG_REGEX = /^[a-zA-Z0-9\-\_]{1,30}$/
