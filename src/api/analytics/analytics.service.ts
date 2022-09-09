import { ForbiddenException, Injectable } from '@nestjs/common'
import { VisitsRepository } from 'src/data/repositories/visit.repository'
import { LinkService } from '../link/link.service'

@Injectable()
export class AnalyticsService {
	constructor(
		private readonly visitsRepository: VisitsRepository,
		private readonly linksService: LinkService,
	) {}

	async findByLinkId({
		userId,
		linkId,
		filters,
	}: {
		userId: number
		linkId: number
		filters: { startHrs: number; endHrs: number }
	}) {
		if (!(await this.linksService.userCanViewLink({ userId, linkId }))) {
			throw new ForbiddenException('User does not have permission to view this link.')
		}

		return this.visitsRepository.findForLink({ linkId, filters })
	}
}
