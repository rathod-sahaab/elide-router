import { Injectable } from '@nestjs/common'
import argon2 from 'argon2'

@Injectable()
export class CryptoService {
	async hash_password(password: string): Promise<string | null> {
		try {
			return await argon2.hash(password)
		} catch (error) {
			return null
		}
	}

	async verify_password(password: string, hash: string): Promise<boolean> {
		try {
			return await argon2.verify(hash, password)
		} catch (error) {
			return false
		}
	}
}
