import { Module } from '@nestjs/common'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsProcessor } from './analytics.processor'
import { AnalyticsService } from './analytics.service'

@Module({
	controllers: [AnalyticsController],
	providers: [AnalyticsService, AnalyticsProcessor],
})
export class AnalyticsModule {}
