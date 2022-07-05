import { Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { ProjectRepository } from 'src/data/repositories/project.repository'

@Injectable()
export class ProjectService {
	constructor(private readonly projectRepository: ProjectRepository) {}

	getAllProjects({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.projectRepository.getAllProjects({ userId, page, limit })
	}
}
