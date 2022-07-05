import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProjectService } from './project.service'

@Controller('projects')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getAllProjects(@Req() { user }: FastifyRequest, @Param() { page, limit }: PaginationQuery) {
		this.projectService.getAllProjects({ userId: user.sub, page, limit })
	}

	@Get(':id/links')
	@UseGuards(JwtAuthGuard)
	getProjectLinks(
		@Req() { user }: FastifyRequest,
		@Param() { id, page, limit }: { id: number } & PaginationQuery,
	) {
		this.projectService.getProjectLinks({ userId: user.sub, projectId: id, limit, page })
	}
}
