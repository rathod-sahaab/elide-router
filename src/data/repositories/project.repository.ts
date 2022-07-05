import { Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PrismaService } from './prisma.service'

@Injectable()
export class ProjectRepository {
	constructor(private readonly prisma: PrismaService) {}

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
}
