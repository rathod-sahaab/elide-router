import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AnalyticsService } from './analytics.service'
import { GetForLinkParams, GetForLinkQuery } from './dto/get-for-link.dto'

@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('link/:linkId')
	getForLink(
		@Req() { user }: FastifyRequest,
		@Param() { linkId }: GetForLinkParams,
		@Query() { startHrs = 24, endHrs = 0 }: GetForLinkQuery,
	) {
		return this.analyticsService.findByLinkId({
			userId: user.sub,
			linkId,
			filters: {
				startHrs,
				endHrs,
			},
		})
	}
}
