import { Injectable } from '@nestjs/common'
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
