import { Module } from '@nestjs/common'
import { LinkModule } from '../link/link.module'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsProcessor } from './analytics.processor'
import { AnalyticsService } from './analytics.service'

@Module({
	imports: [LinkModule],
	controllers: [AnalyticsController],
	providers: [AnalyticsService, AnalyticsProcessor],
})
export class AnalyticsModule {}
