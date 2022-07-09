import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { OrganisationMemberRole } from '@prisma/client'
import { OrganisationRepository } from 'src/data/repositories/organisation.repository'
import { UserOrganisationRepository } from 'src/data/repositories/user-on-organisation.repository'
import { UserRepository } from 'src/data/repositories/user.repository'

@Injectable()
export class OrganisationService {
	constructor(
		private readonly organisationRepository: OrganisationRepository,
		private readonly userRepository: UserRepository,
		private readonly userOrganisationRepository: UserOrganisationRepository,
	) {}

	getUserOrganisations({ userId }: { userId: number }) {
		this.organisationRepository.getUserOrganisations({ userId })
	}

	getOrganisationLinks({ userId, organisationId }: { userId: number; organisationId: number }) {
		if (!this.userRepository.userCanViewInOrganisation({ userId, organisationId })) {
			throw new UnauthorizedException("You don't have permission to view this organisation")
		}
		return this.organisationRepository.getLinks({ organisationId })
	}

	getOrganisationProjects({ userId, organisationId }: { userId: number; organisationId: number }) {
		if (!this.userRepository.userCanViewInOrganisation({ userId, organisationId })) {
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
}
