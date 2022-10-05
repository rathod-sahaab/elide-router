import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { hash as argon2hash, verify as argon2verify } from 'argon2'
import { sign as jwtSign, verify as jwtVerify } from 'jsonwebtoken'
import {
	EmailVerificationPayload,
	ForgotPasswordPayload,
	RefreshTokenPayload,
} from 'src/commons/types/token-payload'

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

	private jwtSigner(
		data: any,
		{ secret, validity }: { secret: string; validity: string },
	): string | null {
		try {
			return jwtSign(data, secret, { expiresIn: validity })
		} catch (error) {
			return null
		}
	}

	private jwtVerifier(
		token: string,
		{ secret, ignoreExpiration = false }: { secret: string; ignoreExpiration?: boolean },
	): any {
		try {
			return jwtVerify(token, secret, { ignoreExpiration })
		} catch (error) {
			return null
		}
	}

	signRefreshToken(data: RefreshTokenPayload): string | null {
		return this.jwtSigner(data, {
			secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
			validity: this.configService.get('JWT_REFRESH_TOKEN_VALIDITY'),
		})
	}

	verifyRefreshToken(token: string, ignoreExpiration = false): RefreshTokenPayload {
		return this.jwtVerifier(token, {
			secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
			ignoreExpiration,
		}) as RefreshTokenPayload
	}

	signEmailConfirmationToken(data: EmailVerificationPayload): string | null {
		return this.jwtSigner(data, {
			secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
			validity: this.configService.get('JWT_EMAIL_VERIFICATION_VALIDITY'),
		})
	}

	verifyEmailConfirmationToken(token: string): EmailVerificationPayload {
		return this.jwtVerifier(token, {
			secret: this.configService.get('JWT_EMAIL_VERIFICATION_SECRET'),
		}) as EmailVerificationPayload
	}

	signForgotPasswordToken(data: ForgotPasswordPayload): string | null {
		return this.jwtSigner(data, {
			secret: this.configService.get('JWT_PASSWORD_RESET_SECRET'),
			validity: this.configService.get('JWT_PASSWORD_RESET_VALIDITY'),
		})
	}

	verifyForgotPasswordToken(token: string): ForgotPasswordPayload {
		return this.jwtVerifier(token, {
			secret: this.configService.get('JWT_PASSWORD_RESET_SECRET'),
		}) as ForgotPasswordPayload
	}
}
