import {
	ForbiddenException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { OrganisationInvitationStatus, OrganisationMemberRole } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { OrganisationInvitationRepository } from 'src/data/repositories/organisation-invitations.repository'
import { OrganisationRepository } from 'src/data/repositories/organisation.repository'
import { UserOrganisationRepository } from 'src/data/repositories/user-on-organisation.repository'
import { UserRepository } from 'src/data/repositories/user.repository'

@Injectable()
export class OrganisationService {
	constructor(
		private readonly organisationRepository: OrganisationRepository,
		private readonly userRepository: UserRepository,
		private readonly userOrganisationRepository: UserOrganisationRepository,
		private readonly organisationInvitationRepository: OrganisationInvitationRepository,
	) {}

	getUserOrganisations({ userId }: { userId: number }) {
		return this.organisationRepository.getUserOrganisations({ userId })
	}

	async getOrganisation({ userId, organisationId }: { userId: number; organisationId: number }) {
		if (!(await this.userCanViewOrganisation({ userId, organisationId }))) {
			throw new ForbiddenException("User can't view this organisation")
		}
		return this.organisationRepository.getOrganisation({ organisationId })
	}

	async getOrganisationLinks({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}) {
		if (!(await this.userRepository.userCanViewInOrganisation({ userId, organisationId }))) {
			throw new UnauthorizedException("You don't have permission to view this organisation")
		}
		return this.organisationRepository.getLinks({ organisationId })
	}

	async getOrganisationProjects({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}) {
		if (!(await this.userRepository.userCanViewInOrganisation({ userId, organisationId }))) {
			throw new UnauthorizedException("You don't have permission to view this organisation")
		}
		return this.organisationRepository.getProjects({ organisationId })
	}

	createOrganisation({
		userId,
		name,
		description,
	}: {
		userId: number
		name: string
		description?: string
	}) {
		return this.organisationRepository.createOrganisation({
			userId,
			name,
			description,
		})
	}

	async addMember({
		userId,
		organisationId,
		memberEmail,
		role,
	}: {
		userId: number
		organisationId: number
		memberEmail: string
		role: OrganisationMemberRole
	}) {
		const toBeMember = await this.userRepository.user({ email: memberEmail })
		if (!toBeMember) {
			throw new NotFoundException('User not found')
		}
		if (!(await this.userRepository.canAddMembers({ userId, organisationId }))) {
			throw new UnauthorizedException("You don't have permission to add members")
		}
		return this.userOrganisationRepository.addInvite({
			memberId: toBeMember.id,
			organisationId,
			role,
		})
	}

	async deleteMember({
		userId,
		organisationId,
		memberId,
	}: {
		userId: number
		organisationId: number
		memberId: number
	}) {
		const toBeMember = await this.userRepository.user({ id: memberId })
		if (!toBeMember) {
			throw new NotFoundException('User not found')
		}
		if (!(await this.userRepository.canDeleteMembers({ userId, organisationId }))) {
			throw new UnauthorizedException("You don't have permission to add members")
		}
		return this.userOrganisationRepository.deleteMember({
			organisationId,
			memberId,
		})
	}

	private async userCanViewOrganisation({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}): Promise<boolean> {
		const orgRelation = await this.userOrganisationRepository.getOrganisationRelation({
			userId,
			organisationId,
		})

		if (!orgRelation) {
			return false
		}

		return true
	}

	private async userCanViewInOrganisationMembers({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}): Promise<boolean> {
		return this.userCanViewOrganisation({ userId, organisationId })
	}

	private async userCanViewInOrganisationInvitations({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}): Promise<boolean> {
		const orgRelation = await this.userOrganisationRepository.getOrganisationRelation({
			userId,
			organisationId,
		})

		if (!orgRelation) {
			return false
		}

		return orgRelation.role === OrganisationMemberRole.ADMIN
	}

	async getOrganisationMembers({
		userId,
		organisationId,
		offset,
		limit,
	}: {
		userId: number
		organisationId: number
		offset: number
		limit: number
	}) {
		if (!(await this.userCanViewInOrganisationMembers({ userId, organisationId }))) {
			throw new ForbiddenException("User can't view org members")
		}

		return this.organisationRepository.getMembers({ organisationId, offset, limit })
	}

	async getOrganisationInvitations({
		userId,
		organisationId,
		offset,
		limit,
		status,
	}: {
		userId: number
		organisationId: number
		status?: OrganisationInvitationStatus
	} & PaginationArgs) {
		if (
			!(await this.userCanViewInOrganisationInvitations({
				userId,
				organisationId,
			}))
		) {
			throw new ForbiddenException("You don't have permission to view invitations")
		}
		return this.organisationInvitationRepository.getInvitationsByOrganisation({
			organisationId,
			offset,
			limit,
			status,
		})
	}

	private userCanCancelInvitations({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}) {
		return this.userCanViewInOrganisationInvitations({
			userId,
			organisationId,
		})
	}

	async cancelInvitation({
		userId,
		organisationId,
		invitationId,
	}: {
		userId: number
		organisationId: number
		invitationId: string
	}) {
		if (
			!(await this.userCanCancelInvitations({
				userId,
				organisationId,
			}))
		) {
			throw new ForbiddenException("You don't have permission to view invitations")
		}
		return this.organisationInvitationRepository.cancelInvitation({
			id: invitationId,
		})
	}
}
