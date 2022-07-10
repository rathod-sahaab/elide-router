import { Injectable } from '@nestjs/common'
import { OrganisationInvitationStatus, Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class OrganisationInvitationRepository {
	constructor(private readonly prisma: PrismaService) {}

	getInvitation({ id }: { id: string }) {
		return this.prisma.organisationInvitation.findUnique({ where: { id } })
	}

	acceptInvitation({ id }: { id: string }) {
		return this.prisma.organisationInvitation.update({
			where: { id },
			data: { status: OrganisationInvitationStatus.ACCEPTED },
		})
	}

	rejectInvitation({ id }: { id: string }) {
		return this.prisma.organisationInvitation.update({
			where: { id },
			data: { status: OrganisationInvitationStatus.REJECTED },
		})
	}

	async getInvitations({
		userId,
		page,
		limit,
		status = OrganisationInvitationStatus.PENDING,
	}: {
		userId: number
		status?: OrganisationInvitationStatus
	} & PaginationArgs) {
		const filter: Prisma.OrganisationInvitationWhereInput = {
			userId,
			status,
		}
		const invitations = await this.prisma.organisationInvitation.findMany({
			where: filter,
			skip: (page - 1) * limit,
			take: limit,
		})

		const count = await this.prisma.organisationInvitation.count({
			where: filter,
		})

		return { invitations, count }
	}
}
