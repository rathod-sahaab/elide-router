import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { AnalyticsData } from './app.service'
import { VISITS_QUEUE, VISITS_QUEUES_ANALYTICS } from './commons/types/queues'

@Processor(VISITS_QUEUE)
export class AppProcessor {
	@Process(VISITS_QUEUES_ANALYTICS)
	async handleAnalytics(job: Job<AnalyticsData>) {
		console.log('Processing analytics...')
		setTimeout(() => {
			console.log(job.data)
		}, 5000)
	}
}
