import { InjectQueue } from '@nestjs/bull'
import {
	CACHE_MANAGER,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Link } from '@prisma/client'
import { Queue } from 'bull'
import { Cache } from 'cache-manager'
import { getLinkCacheKey } from './commons/functions/cache-keys'
import { VISITS_QUEUE, VISITS_QUEUES_ANALYTICS } from './commons/types/queues'
import { LinkRepository } from './data/repositories/link.repository'

@Injectable()
export class AppService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
		@InjectQueue(VISITS_QUEUE) private readonly visitsQueue: Queue,
	) {}

	private async getLinkCacheAside({
		slug,
	}: {
		slug: string
	}): Promise<{ link: Link; cacheHit: boolean }> {
		const cachedValue = (await this.cacheManager.get(getLinkCacheKey(slug))) as Link
		return {
			link: cachedValue || (await this.linkRepository.linkBySlug({ slug })),
			cacheHit: !!cachedValue,
		}
	}

	// Get the url where we should redirect
	async getLink({
		slug,
	}: {
		slug: string
	}): Promise<{ linkId?: number | undefined; url: string }> {
		if (slug === '') {
			return { url: this.configService.get<string>('FRONTEND_URL') }
		}

		const { link, cacheHit } = await this.getLinkCacheAside({ slug })

		if (!link) {
			throw new NotFoundException("Link you're looking for doesn't exist")
		}

		if (!cacheHit) {
			await this.cacheManager.set(getLinkCacheKey(slug), link)
		}

		if (!link.active) {
			throw new ForbiddenException('Requested link is inactive currently.')
		}

		await this.visitsQueue.add('visit', {
			slug,
		})

		return { url: link.url, linkId: link.id }
	}

	async analytics(data: {
		linkId: number
		visitorJwt?: string
		referer?: string
		ip: string
		time: Date
		userAgent?: string
	}) {
		console.log('Queueing request')
		await this.visitsQueue.add(VISITS_QUEUES_ANALYTICS, data)
	}
}
