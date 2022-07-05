import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserEntity } from 'src/data/entities/user.entity'
import { UserRepository } from 'src/data/repositories/user.repository'
import { CryptoService } from 'src/utils/crypto.service'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'

@Injectable()
export class UserService {
	constructor(
		private readonly cryptoService: CryptoService,
		private readonly refreshRepository: RefreshTokenRepository,
		private readonly userRepository: UserRepository,
	) {}

	async getProfile(userId: number): Promise<UserEntity> {
		const user = await this.userRepository.user({ id: userId })
		return new UserEntity(user)
	}

	async changePassword({
		userId,
		password,
		newPassword,
	}: {
		userId: number
		password: string
		newPassword: string
	}) {
		const user = await this.userRepository.user({ id: userId })

		if (!this.cryptoService.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Invalid password')
		}

		await this.userRepository.updateUser(
			{
				id: userId,
			},
			{
				passwordHash: await this.cryptoService.hashPassword(newPassword),
			},
		)

		return {
			message: 'Password changed successfully',
		}
	}

	async deleteSessions({ userId, password }: { userId: number; password: string }) {
		const user = await this.userRepository.user({ id: userId })

		if (!this.cryptoService.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Invalid password')
		}

		await this.refreshRepository.deleteRefreshTokens({ userId })

		return {
			message: 'Sessions deleted successfully',
		}
	}
}
