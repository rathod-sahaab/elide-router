import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class ProjectRepository {
	constructor(private readonly prisma: PrismaService) {}

	async userCanGetProject({ userId, projectId }: { userId: number; projectId: number }) {
		const project = await this.prisma.project.findUnique({
			where: {
				id: projectId,
			},
		})

		if (!project) {
			throw new NotFoundException('Project not found')
		}

		if (project.ownerId === userId) {
			return true
		}

		if (project.organisationId) {
			const userOrgRelation = await this.prisma.usersOnOrganisations.findUnique({
				where: {
					userId_organisationId: {
						userId,
						organisationId: project.organisationId,
					},
				},
			})
			return !!userOrgRelation
		}

		return false
	}

	async getAllProjects({ userId, page, limit }: { userId: number } & PaginationArgs) {
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

	async getProjectLinks({ projectId, page, limit }: { projectId: number } & PaginationArgs) {
		return this.prisma.link.findMany({
			where: {
				projectId,
			},
			skip: (page - 1) * limit,
			take: limit,
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	async createProject({
		creatorId,
		organisationId,
		description,
		name,
	}: {
		creatorId: number
		organisationId?: number
		name: string
		description?: string
	}) {
		return this.prisma.project.create({
			data: {
				ownerId: creatorId,
				name,
				description,
				organisationId,
			},
		})
	}
}
