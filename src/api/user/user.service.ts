import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { UserEntity } from 'src/data/entities/user.entity'
import { UserRepository } from 'src/data/repositories/user.repository'
import { CryptoService } from 'src/utils/crypto.service'
import { OrganisationInvitationRepository } from 'src/data/repositories/organisation-invitations.repository'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { UserOrganisationRepository } from 'src/data/repositories/user-on-organisation.repository'
import { ElideMailService } from 'src/utils/mail.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class UserService {
	constructor(
		// serivces
		private readonly cryptoService: CryptoService,
		private readonly mailService: ElideMailService,
		private readonly configService: ConfigService,

		// repositories
		private readonly userRepository: UserRepository,
		private readonly userOnOrganisationRepository: UserOrganisationRepository,
		private readonly organisationInvitationRepository: OrganisationInvitationRepository,
	) {}

	async getProfile(userId: number): Promise<UserEntity> {
		const user = await this.userRepository.user({ id: userId })
		return new UserEntity(user)
	}

	// TODO: Rate limit
	async sendVerificationEmail(userId: number) {
		const user = await this.userRepository.user({ id: userId })

		if (!user) {
			throw new NotFoundException('User not found')
		}

		if (user.verified) {
			throw new BadRequestException('User already verified')
		}

		const verificationToken = this.cryptoService.signEmailConfirmationToken({
			sub: user.id,
			email: user.email,
		})
		const FRONTEND_URL = this.configService.get('FRONTEND_URL')

		const verificationLink = `${FRONTEND_URL}/account/verify?token=${verificationToken}`

		await this.mailService.sendEmailVerification({
			email: user.email,
			data: {
				name: user.name,
				verificationLink,
			},
		})

		return {
			message: 'Verification email sent successfully',
		}
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
		return await this.organisationInvitationRepository.getUserInvitations({
			userId,
			offset,
			limit,
		})
	}

	async getPendingInvitationsCount({ userId }: { userId: number }) {
		return await this.organisationInvitationRepository.getUserPendingInvitationsCount({
			userId,
		})
	}

	async acceptInvitation({ userId, invitationId }: { userId: number; invitationId: string }) {
		const invitation = await this.organisationInvitationRepository.getInvitation({
			id: invitationId,
		})

		if (!invitation || invitation.userId !== userId) {
			throw new UnauthorizedException('Invalid invitation')
		}

		{
			const { id, userId, organisationId, role } = invitation
			// TODO: use transactions
			await this.organisationInvitationRepository.acceptInvitation({
				id,
			})

			await this.userOnOrganisationRepository.addMember({
				organisationId,
				userId,
				role,
			})
		}

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
