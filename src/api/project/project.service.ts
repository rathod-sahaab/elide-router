import { ForbiddenException, Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { ProjectRepository } from 'src/data/repositories/project.repository'

@Injectable()
export class ProjectService {
	constructor(private readonly projectRepository: ProjectRepository) {}

	getAllProjects({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		return this.projectRepository.getAllProjects({ userId, offset, limit })
	}

	getProjectLinks({
		userId,
		projectId,
		offset,
		limit,
	}: { userId: number; projectId: number } & PaginationArgs) {
		if (!this.projectRepository.userCanGetProject({ userId, projectId })) {
			throw new ForbiddenException('Project not found')
		}
		return this.projectRepository.getProjectLinks({ projectId, offset, limit })
	}

	createLink({
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
		return this.projectRepository.createProject({
			creatorId,
			organisationId,
			description,
			name,
		})
	}
}
