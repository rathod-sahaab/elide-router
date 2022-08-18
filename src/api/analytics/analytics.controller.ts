import { Controller, Get, Param } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'

@Controller('api/analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('link/:linkId')
	getForLink(@Param() { linkId }: { linkId: number }) {
		return this.analyticsService.findByLinkId(linkId)
	}
}
