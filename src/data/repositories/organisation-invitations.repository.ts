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

	cancelInvitation({ id }: { id: string }) {
		return this.prisma.organisationInvitation.update({
			where: { id },
			data: { status: OrganisationInvitationStatus.CANCELED },
		})
	}

	async getInvitations({
		userId,
		offset,
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
		return this.prisma.organisationInvitation.findMany({
			where: filter,
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getInvitationsByOrganisation({
		organisationId,
		offset,
		limit,
		status,
	}: {
		organisationId: number
		status?: OrganisationInvitationStatus
	} & PaginationArgs) {
		const filter: Prisma.OrganisationInvitationWhereInput = {
			organisationId,
		}
		if (status) {
			filter.status = status
		}
		return this.prisma.organisationInvitation.findMany({
			where: filter,
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		})
	}
}
