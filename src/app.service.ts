import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LinkRepository } from './data/repositories/link.repository'

@Injectable()
export class AppService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly configService: ConfigService,
	) {}

	// Get the url where we should redirect
	async visitLink({ slug }: { slug: string }): Promise<string> {
		if (slug === '') {
			return this.configService.get('FRONTEND_URL')
		}
		// TODO: check in cache first
		const link = await this.linkRepository.linkBySlug({ slug })

		// TODO: analytics stuff

		return link.url
	}
}
