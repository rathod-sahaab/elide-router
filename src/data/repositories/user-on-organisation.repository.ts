import { Injectable } from '@nestjs/common'
import { OrganisationMemberRole } from '@prisma/client'
import { PrismaService } from './prisma.service'
@Injectable()
export class UserOrganisationRepository {
	constructor(private readonly prisma: PrismaService) {}

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

	addMember({
		organisationId,
		userId,
		role,
	}: {
		organisationId: number
		userId: number
		role: OrganisationMemberRole
	}) {
		return this.prisma.usersOnOrganisations.create({
			data: {
				organisationId,
				userId,
				role,
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
