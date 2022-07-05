import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ProjectService } from './project.service'

@Controller('project')
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Get()
	@UseGuards(JwtAuthGuard)
	getAllProjects(@Req() { user }: FastifyRequest, @Param() { page, limit }: PaginationQuery) {
		this.projectService.getAllProjects({ userId: user.sub, page, limit })
	}
}
