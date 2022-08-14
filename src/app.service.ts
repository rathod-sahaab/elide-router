import {
	CACHE_MANAGER,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Link } from '@prisma/client'
import { Cache } from 'cache-manager'
import { getLinkCacheKey } from './commons/functions/cache-keys'
import { LinkRepository } from './data/repositories/link.repository'

@Injectable()
export class AppService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
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
	async visitLink({ slug }: { slug: string }): Promise<string> {
		if (slug === '') {
			return this.configService.get('FRONTEND_URL')
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

		// TODO: analytics stuff

		return link.url
	}
}
