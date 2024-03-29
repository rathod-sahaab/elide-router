import { Injectable } from '@nestjs/common'
import { OrganisationInvitationStatus, OrganisationMemberRole, Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class OrganisationInvitationRepository {
	constructor(private readonly prisma: PrismaService) {}

	getPendingInvitation({ userId, organisationId }: { userId: number; organisationId: number }) {
		return this.prisma.organisationInvitation.findFirst({
			where: {
				userId,
				organisationId,
				status: OrganisationInvitationStatus.PENDING,
			},
		})
	}

	getInvitation({ id }: { id: string }) {
		return this.prisma.organisationInvitation.findUnique({ where: { id } })
	}

	createInvitation({
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

	async getUserInvitations({
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
			include: {
				organisation: {
					select: {
						id: true,
						name: true,
						description: true,
					},
				},
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async getUserPendingInvitationsCount({ userId }: { userId: number }) {
		return this.prisma.organisationInvitation.count({
			where: {
				userId,
				status: OrganisationInvitationStatus.PENDING,
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
