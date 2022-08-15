import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AnalyticsController } from './analytics.controller'
import { AnalyticsProcessor } from './analytics.processor'
import { AnalyticsService } from './analytics.service'
import { Visit, VisitSchema } from './models/visit.model'

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Visit.name,
				schema: VisitSchema,
			},
		]),
	],
	controllers: [AnalyticsController],
	providers: [AnalyticsService, AnalyticsProcessor],
})
export class AnalyticsModule {}
