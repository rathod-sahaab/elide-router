import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { CryptoService } from 'src/services/crypto.service'
import { UserService } from 'src/services/data/user.service'
import { UserWithoutPassword } from 'src/utils/types'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UserService,
		private readonly jwtService: JwtService,
		private readonly cryptoService: CryptoService,
	) {}

	async validateUser(email: string, password: string): Promise<UserWithoutPassword> {
		const user = await this.usersService.user({ email })
		// FIXME: use argon2
		if (user && (await this.cryptoService.verify_password(password, user.password))) {
			const { password, ...rest } = user
			return rest
		}
		return null
	}

	async login(user: UserWithoutPassword): Promise<{ accessToken: string }> {
		const payload = { email: user.email, sub: user.id }
		return {
			accessToken: this.jwtService.sign(payload),
		}
	}
}
