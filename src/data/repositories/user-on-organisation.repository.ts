import { Injectable } from '@nestjs/common'
import { OrganisationInvitationStatus, OrganisationMemberRole } from '@prisma/client'
import { PrismaService } from './prisma.service'
@Injectable()
export class UserOrganisationRepository {
	constructor(private readonly prisma: PrismaService) {}

	addInvite({
		organisationId,
		memberId,
		role,
	}: {
		organisationId: number
		memberId: number
		role: OrganisationMemberRole
	}) {
		return this.prisma.organisationInvitation.create({
			data: {
				userId: memberId,
				organisationId,
				role,
				status: OrganisationInvitationStatus.PENDING,
			},
		})
	}

	deleteMember({ organisationId, memberId }: { organisationId: number; memberId: number }) {
		return this.prisma.usersOnOrganisations.delete({
			where: {
				userId_organisationId: {
					organisationId,
					userId: memberId,
				},
			},
		})
	}

	async getOrganisationRelation({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}) {
		return await this.prisma.usersOnOrganisations.findUnique({
			where: {
				userId_organisationId: {
					userId,
					organisationId,
				},
			},
		})
	}
}
