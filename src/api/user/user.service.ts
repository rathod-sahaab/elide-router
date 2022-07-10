import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserEntity } from 'src/data/entities/user.entity'
import { UserRepository } from 'src/data/repositories/user.repository'
import { CryptoService } from 'src/utils/crypto.service'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'
import { OrganisationInvitationRepository } from 'src/data/repositories/organisation-invitations.repository'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { HelperService } from 'src/utils/helper.service'

@Injectable()
export class UserService {
	constructor(
		private readonly cryptoService: CryptoService,
		private readonly refreshRepository: RefreshTokenRepository,
		private readonly userRepository: UserRepository,
		private readonly organisationInvitationRepository: OrganisationInvitationRepository,
		private readonly helperService: HelperService,
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

	async deleteSession({
		userId,
		password,
		sessionId,
	}: {
		userId: number
		password: string
		sessionId: string
	}) {
		const user = await this.userRepository.user({ id: userId })

		if (!this.cryptoService.verifyPassword(password, user.passwordHash)) {
			throw new UnauthorizedException('Invalid password')
		}

		const token = await this.refreshRepository.refreshToken({ id: sessionId })

		if (!token || token.userId !== userId) {
			throw new UnauthorizedException('Invalid session')
		}

		await this.refreshRepository.deleteRefreshToken({ id: sessionId })

		return {
			message: 'Session deleted successfully',
		}
	}

	// TODO: add feature to select staus
	async getInvitations({ userId, page, limit }: { userId: number } & PaginationArgs) {
		const { invitations, count } = await this.organisationInvitationRepository.getInvitations({
			userId,
			page,
			limit,
		})

		return this.helperService.formatPaginationResponse({
			results: invitations,
			count,
			page,
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
