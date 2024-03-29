import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FastifyRequest } from '../../../commons/types/fastify'
import { RefreshTokenPayload, TokenPayload } from '../../../commons/types/token-payload'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'ACCESS') {
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

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'REFRESH') {
	constructor(readonly configService: ConfigService) {
		const refreshTokenCookieName = configService.get<string>('JWT_REFRESH_TOKEN_COOKIE_NAME')
		const refreshTokenSecret = configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
		super({
			jwtFromRequest: (req: FastifyRequest) => req.cookies[refreshTokenCookieName] ?? null,
			ignoreExpiration: false,
			secretOrKey: refreshTokenSecret,
		})
	}

	validate(refreshTokenPayload: RefreshTokenPayload) {
		return refreshTokenPayload
	}
}
