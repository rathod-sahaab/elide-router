import { Controller, Get } from '@nestjs/common'
import {
	HealthCheckService,
	HealthCheck,
	MemoryHealthIndicator,
	DiskHealthIndicator,
} from '@nestjs/terminus'

@Controller('api/health')
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private memoryHealthIndicator: MemoryHealthIndicator,
		private diskHealthIndicator: DiskHealthIndicator,
	) {}

	@Get()
	@HealthCheck()
	check() {
		return this.health.check([
			// // the process should not use more than 300MB memory
			// () => this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
			// // The process should not have more than 300MB RSS memory allocated
			// () => this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024),
			// // the used disk storage should not exceed the 50% of the available space
			// () =>
			// 	this.diskHealthIndicator.checkStorage('disk health', {
			// 		thresholdPercent: 0.5,
			// 		path: '/',
			// 	}),
		])
	}
}
