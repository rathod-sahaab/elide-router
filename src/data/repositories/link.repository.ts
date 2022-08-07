import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class LinkRepository {
	constructor(private readonly prisma: PrismaService) {}

	async link({ id }: { id: number }) {
		return this.prisma.link.findUnique({
			where: {
				id,
			},
		})
	}

	async linkBySlug({ slug }: { slug: string }) {
		return this.prisma.link.findUnique({
			where: {
				slug,
			},
		})
	}

	// Get all links of user which are not part of an organisation or a project
	async getUserLinks({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		const userLinkWhere: Prisma.LinkWhereInput = {
			creatorId: userId,
			organisationId: null,
			projectId: null,
		}

		return this.prisma.link.findMany({
			where: userLinkWhere,
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	// Get all projects of a user which are not a part of the organisation
	async getUserProjects({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		return this.prisma.project.findMany({
			where: {
				ownerId: userId,
				organisationId: null,
			},
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	// Get all organisations of a user
	async getUserOrganisations({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		return this.prisma.usersOnOrganisations.findMany({
			where: {
				userId: userId,
			},
			skip: offset,
			take: limit,
			include: {
				organisation: true,
			},
		})
	}

	// Get all links of a project
	async getProjectLinks({ projectId, offset, limit }: { projectId: number } & PaginationArgs) {
		return this.prisma.link.findMany({
			where: {
				projectId: projectId,
			},
			skip: offset,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async createLink(data: Prisma.LinkCreateInput) {
		return this.prisma.link.create({
			data,
		})
	}

	async updateLink({
		id,
		url,
		description,
		active,
	}: {
		id: number
		url?: string
		description?: string
		active?: boolean
	}) {
		return this.prisma.link.update({
			where: {
				id,
			},
			data: {
				url,
				description,
				active,
			},
		})
	}

	async deleteLink({ id }: { id: number }) {
		return this.prisma.link.delete({
			where: {
				id,
			},
		})
	}
}
