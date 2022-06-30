import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest } from '../interfaces/fastify'
import { TokenPayload } from '../interfaces/token-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(readonly configService: ConfigService) {
		const accessTokenCookieName = configService.get<string>('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const accessTokenSecret = configService.get<string>('JWT_ACCESS_TOKEN_SECRET')
		super({
			jwtFromRequest: (req: FastifyRequest) => req.cookies[accessTokenCookieName] ?? null,
			ignoreExpiration: false,
			secretOrKey: accessTokenSecret,
		})
	}

	async validate(user: TokenPayload) {
		return user
	}
}
