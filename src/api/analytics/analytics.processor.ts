import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { AnalyticsData } from './dto/analytics-data'
import { VISITS_QUEUE, VISITS_QUEUES_ANALYTICS } from '../../commons/types/queues'
import { VisitsRepository } from 'src/data/repositories/visit.repository'
import { lookup } from 'geoip-lite'
import { Types } from 'mongoose'

import * as useragent from 'useragent-ng'

@Processor(VISITS_QUEUE)
export class AnalyticsProcessor {
	constructor(private readonly visitsReposistory: VisitsRepository) {}

	@Process(VISITS_QUEUES_ANALYTICS)
	async handleAnalytics(job: Job<AnalyticsData>) {
		const { ip, visitorId: visitorIdString, userAgent, ...rest } = job.data

		const {
			family: browser,
			os: { family: os },
			device: { family: device },
		} = useragent.parse(userAgent)

		const location = lookup(ip)
		const visitorId = new Types.ObjectId(visitorIdString)

		await this.visitsReposistory.create({
			...rest,
			userAgent: {
				browser,
				os,
				device,
				source: userAgent,
			},
			visitorId,
			location: location
				? {
						country: location.country,
						region: location.region,
						coordinates: location.ll,
				  }
				: undefined,
		})
	}
}
