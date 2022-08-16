import { Injectable } from '@nestjs/common'
import { VisitsRepository } from 'src/data/repositories/visit.repository';

@Injectable()
export class AnalyticsService {
	constructor(private readonly visitsRepository: VisitsRepository) {}

	async findByLinkId(linkId: number) {
		return this.visitsRepository.findForLink({linkId})
	}
}
