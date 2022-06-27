import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserEntity } from 'src/entities/user.entity'
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

	async validateUser(email: string, password: string): Promise<UserEntity> {
		const user = await this.usersService.user({ email })

		if (user && (await this.cryptoService.verify_password(password, user.password_hash))) {
			return new UserEntity(user)
		}

		return null
	}

	async login(user: UserWithoutPassword): Promise<{ accessToken: string }> {
		const payload = { email: user.email, sub: user.id }
		return {
			accessToken: this.jwtService.sign(payload),
		}
	}

	// TODO: remove this after class-validator is fixed
	async test_get_user(email: string): Promise<UserEntity> {
		const user = await this.usersService.user({ email })
		if (!user) {
			throw new NotFoundException('User with given email not found.')
		}
		return new UserEntity(user)
	}

	async register({
		email,
		name,
		password,
	}: {
		email: string
		name: string
		password: string
	}): Promise<UserEntity> {
		const user = await this.usersService.user({ email })

		if (user) {
			throw new ForbiddenException('Email already in use.')
		}

		const passwordHash = await this.cryptoService.hashPassword(password)

		return new UserEntity(
			await this.usersService.createUser({
				email,
				name,
				password_hash: passwordHash,
			}),
		)
	}
}
