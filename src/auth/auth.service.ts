import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserService } from 'src/services/data/user.service'
import { UserWithoutPassword } from 'src/utils/types'

@Injectable()
export class AuthService {
	constructor(private usersService: UserService, private readonly jwtService: JwtService) {}

	async validateUser(email: string, pass: string): Promise<UserWithoutPassword> {
		const user = await this.usersService.user({ email })
		// FIXME: use argon2
		if (user && user.password === pass) {
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
