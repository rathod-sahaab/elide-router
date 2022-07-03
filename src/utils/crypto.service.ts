import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { hash as argon2hash, verify as argon2verify } from 'argon2'
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import { RefreshTokenPayload } from 'src/commons/types/token-payload'

@Injectable()
export class CryptoService {
	constructor(private readonly configService: ConfigService) {}
	async hashPassword(password: string): Promise<string | null> {
		try {
			return await argon2hash(password)
		} catch (error) {
			return null
		}
	}

	async verifyPassword(password: string, hash: string): Promise<boolean> {
		try {
			return await argon2verify(hash, password)
		} catch (error) {
			return false
		}
	}

	signRefreshToken(data: any): string | null {
		const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET')
		const validity = this.configService.get('JWT_REFRESH_TOKEN_VALIDITY')
		try {
			return jwtSign(data, secret, { expiresIn: validity })
		} catch (error) {
			return null
		}
	}

	/**
	@param token - Refresh token
	@param ignoreExpiration - false by default, true incase we are invalidating it and not using it to authorize user
	@returns {RefreshTokenPayload}
	*/
	verifyRefreshToken(token: string, ignoreExpiration: boolean = false): RefreshTokenPayload {
		const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET')
		try {
			return jwtVerify(token, secret, { ignoreExpiration }) as RefreshTokenPayload
		} catch (error) {
			return null
		}
	}
}
