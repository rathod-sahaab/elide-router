import { Injectable, NotFoundException } from '@nestjs/common'
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

	getProject({ projectId }: { projectId: number }) {
		return this.prisma.project.findUnique({ where: { id: projectId } })
	}

	async getAllProjects({ userId, offset, limit }: { userId: number } & PaginationArgs) {
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

	async getProjectLinks({ projectId, offset, limit }: { projectId: number } & PaginationArgs) {
		return this.prisma.link.findMany({
			where: {
				projectId,
			},
			skip: offset,
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
