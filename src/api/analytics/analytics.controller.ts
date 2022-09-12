import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AnalyticsService } from './analytics.service'
import { GetForLinkParams, GetForLinkQuery } from './dto/get-for-link.dto'

@Controller('api/analytics')
@UseGuards(JwtAuthGuard)
// TODO: Cache these requests
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('links/:linkId/overview')
	analyticsOverview(@Req() { user }: FastifyRequest, @Param() { linkId }: GetForLinkParams) {
		return this.analyticsService.getOverview(user.sub, linkId)
	}

	@Get('links/:linkId/timeseries')
	analyticsWrtTime(
		@Req() { user }: FastifyRequest,
		@Param() { linkId }: GetForLinkParams,
		@Query() { startHrs = 24, endHrs = 0 }: GetForLinkQuery,
	) {
		return this.analyticsService.analyticsWrtTime({
			userId: user.sub,
			linkId,
			filters: {
				startHrs,
				endHrs,
			},
		})
	}

	@Get('links/:linkId/user-agents')
	analyticsWrtUserAgents(
		@Req() { user }: FastifyRequest,
		@Param() { linkId }: GetForLinkParams,
		@Query() { startHrs = 24, endHrs = 0 }: GetForLinkQuery,
	) {
		return this.analyticsService.analyticsWrtUserAgents({
			userId: user.sub,
			linkId,
			filters: {
				startHrs,
				endHrs,
			},
		})
	}
}
