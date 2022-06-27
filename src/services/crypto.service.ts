import { Injectable } from '@nestjs/common'
import { hash, verify } from 'argon2'

@Injectable()
export class CryptoService {
	async hashPassword(password: string): Promise<string | null> {
		try {
			return await hash(password)
		} catch (error) {
			return null
		}
	}

	async verify_password(password: string, hash: string): Promise<boolean> {
		try {
			return await verify(hash, password)
		} catch (error) {
			return false
		}
	}
}
