import * as Joi from 'joi'

export const CONFIG_VALIDATION_SCHEMA = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),
	JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
	JWT_ACCESS_TOKEN_VALIDITY: Joi.string().required(),
	JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
	JWT_REFRESH_TOKEN_VALIDITY: Joi.string().required(),
})
