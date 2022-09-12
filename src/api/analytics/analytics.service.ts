import { ForbiddenException, Injectable } from '@nestjs/common'
import { VisitsRepository } from 'src/data/repositories/visit.repository'
import { LinkService } from '../link/link.service'

@Injectable()
export class AnalyticsService {
	constructor(
		private readonly visitsRepository: VisitsRepository,
		private readonly linksService: LinkService,
	) {}

	async getOverview(
		userId: number,
		linkId: number,
	): Promise<{
		visits: number
		uniqueVisitors: number
	}> {
		if (!(await this.linksService.userCanViewLink({ userId, linkId }))) {
			throw new ForbiddenException('User does not have permission to view this link.')
		}

		return {
			visits: await this.visitsRepository.getTotalVisits(linkId),
			uniqueVisitors: await this.visitsRepository.getTotalUniqueVisitors(linkId),
		}
	}

	async analyticsWrtTime({
		userId,
		linkId,
		filters,
	}: {
		userId: number
		linkId: number
		filters: { startHrs: number; endHrs: number }
	}) {
		const requestTime = new Date().getTime()

		if (!(await this.linksService.userCanViewLink({ userId, linkId }))) {
			throw new ForbiddenException('User does not have permission to view this link.')
		}

		return (await this.visitsRepository.wrtTime({ linkId, filters })).map(
			({
				time,
				visits,
				uniqueVisitors,
			}: {
				time: {
					year: number
					month: number
					day: number
					hour: number
				}
				visits: number
				uniqueVisitors: number
			}) => {
				// Date months are 0-indexed
				const groupDate = new Date(time.year, time.month - 1, time.day, time.hour)
				const groupTime = groupDate.getTime()
				return {
					x: filters.startHrs - Math.floor((requestTime - groupTime) / (60 * 60 * 1000)),
					time: groupDate.toISOString(),
					visits,
					uniqueVisitors,
				}
			},
		)
	}

	async analyticsWrtUserAgents({
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

		return await this.visitsRepository.wrtUserAgents({ linkId, filters })
	}
}
