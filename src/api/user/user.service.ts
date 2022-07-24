import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserEntity } from 'src/data/entities/user.entity'
import { UserRepository } from 'src/data/repositories/user.repository'
import { CryptoService } from 'src/utils/crypto.service'
import { OrganisationInvitationRepository } from 'src/data/repositories/organisation-invitations.repository'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'

@Injectable()
export class UserService {
	constructor(
		private readonly cryptoService: CryptoService,
		private readonly userRepository: UserRepository,
		private readonly organisationInvitationRepository: OrganisationInvitationRepository,
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

	// TODO: add feature to select staus
	async getInvitations({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		return await this.organisationInvitationRepository.getInvitations({
			userId,
			offset,
			limit,
		})
	}

	async acceptInvitation({ userId, invitationId }: { userId: number; invitationId: string }) {
		const invitation = await this.organisationInvitationRepository.getInvitation({
			id: invitationId,
		})

		if (!invitation || invitation.userId !== userId) {
			throw new UnauthorizedException('Invalid invitation')
		}

		await this.organisationInvitationRepository.acceptInvitation({
			id: invitationId,
		})

		return {
			message: 'Invitation accepted successfully',
		}
	}

	async rejectInvitation({ userId, invitationId }: { userId: number; invitationId: string }) {
		const invitation = await this.organisationInvitationRepository.getInvitation({
			id: invitationId,
		})

		if (!invitation || invitation.userId !== userId) {
			throw new UnauthorizedException('Invalid invitation')
		}

		await this.organisationInvitationRepository.rejectInvitation({
			id: invitationId,
		})

		return {
			message: 'Invitation deleted successfully',
		}
	}
}
