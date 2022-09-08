import { Injectable } from '@nestjs/common'
import { VisitsRepository } from 'src/data/repositories/visit.repository'

@Injectable()
export class AnalyticsService {
	constructor(private readonly visitsRepository: VisitsRepository) {}

	async findByLinkId({
		linkId,
		filters,
	}: {
		linkId: number
		filters: { startHrs: number; endHrs: number }
	}) {
		// TODO: authorization check
		return this.visitsRepository.findForLink({ linkId, filters })
	}
}
