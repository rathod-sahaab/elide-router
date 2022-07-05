import { ForbiddenException, Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { ProjectRepository } from 'src/data/repositories/project.repository'

@Injectable()
export class ProjectService {
	constructor(private readonly projectRepository: ProjectRepository) {}

	getAllProjects({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.projectRepository.getAllProjects({ userId, page, limit })
	}

	getProjectLinks({
		userId,
		projectId,
		page,
		limit,
	}: { userId: number; projectId: number } & PaginationArgs) {
		if (!this.projectRepository.userCanGetProject({ userId, projectId })) {
			throw new ForbiddenException('Project not found')
		}
		return this.projectRepository.getProjectLinks({ projectId, page, limit })
	}
}
