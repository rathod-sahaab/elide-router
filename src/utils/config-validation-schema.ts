import Joi from 'joi'

export const CONFIG_VALIDATION_SCHEMA = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),
})
