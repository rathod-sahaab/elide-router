import { Injectable } from '@nestjs/common'
import { Link, Prisma } from '@prisma/client'
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

	/**
	Get all links of user which are not part of an organisation or a project
	*/
	async getUserLinks({
		userId,
		page,
		limit,
	}: { userId: number } & PaginationArgs): Promise<{ links: Link[]; count: number }> {
		const userLinkWhere: Prisma.LinkWhereInput = {
			creatorId: userId,
			organisationId: null,
			projectId: null,
		}

		const links = await this.prisma.link.findMany({
			where: userLinkWhere,
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})

		const count = await this.prisma.link.count({
			where: userLinkWhere,
		})

		return {
			links,
			count,
		}
	}

	/**
	Get all projects of a user which are not a part of the organisation
	*/
	async getUserProjects({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.prisma.project.findMany({
			where: {
				ownerId: userId,
				organisationId: null,
			},
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	/**
	Get all organisations of a user
	*/
	async getUserOrganisations({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.prisma.usersOnOrganisations.findMany({
			where: {
				userId: userId,
			},
			skip: (page - 1) * limit,
			take: limit,
			include: {
				organisation: true,
			},
		})
	}

	/**
	Get all links of a project
	*/
	async getProjectLinks({ projectId, page, limit }: { projectId: number } & PaginationArgs) {
		return this.prisma.link.findMany({
			where: {
				projectId: projectId,
			},
			skip: (page - 1) * limit,
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

	async deleteLink({ id }: { id: number }) {
		return this.prisma.link.delete({
			where: {
				id,
			},
		})
	}
}
