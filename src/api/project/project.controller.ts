import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateProjectBody } from './dto/create-project.dto'
import { ProjectService } from './project.service'

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get()
	getAllProjects(@Req() { user }: FastifyRequest, @Param() { offset, limit }: PaginationQuery) {
		return this.projectService.getAllProjects({ userId: user.sub, offset, limit })
	}

	@Get(':id/links')
	getProjectLinks(
		@Req() { user }: FastifyRequest,
		@Param() { id, offset, limit }: { id: number } & PaginationQuery,
	) {
		return this.projectService.getProjectLinks({ userId: user.sub, projectId: id, limit, offset })
	}

	@Post()
	createProject(
		@Req() { user }: FastifyRequest,
		@Body() { organisationId, description, name }: CreateProjectBody,
	) {
		return this.projectService.createLink({
			creatorId: user.sub,
			organisationId,
			description,
			name,
		})
	}
}
