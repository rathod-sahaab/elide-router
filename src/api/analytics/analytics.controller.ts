import { Controller, Get, Param, Query } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { GetForLinkParams, GetForLinkQuery } from './dto/get-for-link.dto'

@Controller('api/analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('link/:linkId')
	getForLink(
		@Param() { linkId }: GetForLinkParams,
		@Query() { startHrs = 24, endHrs = 0 }: GetForLinkQuery,
	) {
		return this.analyticsService.findByLinkId({
			linkId,
			filters: {
				startHrs,
				endHrs,
			},
		})
	}
}
