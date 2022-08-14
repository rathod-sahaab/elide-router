import {
	CACHE_MANAGER,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cache } from 'cache-manager'
import { getLinkCacheKey } from './commons/functions/cache-keys'
import { CachePayloadLink } from './commons/types/cache-payload'
import { LinkRepository } from './data/repositories/link.repository'

@Injectable()
export class AppService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	// Get the url where we should redirect
	async visitLink({ slug }: { slug: string }): Promise<string> {
		if (slug === '') {
			return this.configService.get('FRONTEND_URL')
		}

		const cachedValue = (await this.cacheManager.get(getLinkCacheKey(slug))) as CachePayloadLink

		const link = cachedValue || (await this.linkRepository.linkBySlug({ slug }))

		if (!link) {
			throw new NotFoundException("Link you're looking for doesn't exist")
		}

		if (!link.active) {
			throw new ForbiddenException('Requested link is inactive currently.')
		}

		if (!cachedValue) {
			console.log('Cache Miss')
			await this.cacheManager.set(getLinkCacheKey(slug), link)
		} else {
			console.log('Cache Hit', JSON.stringify(cachedValue, null, 3))
		}

		// TODO: analytics stuff

		return link.url
	}
}
