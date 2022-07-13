import { Injectable } from '@nestjs/common'
import { LinkRepository } from './data/repositories/link.repository'

@Injectable()
export class AppService {
	constructor(private readonly linkRepository: LinkRepository) {}

	// Get the url where we should redirect
	async visitLink({ slug }: { slug: string }): Promise<string> {
		// TODO: check in cache first
		const link = await this.linkRepository.linkBySlug({ slug })

		// TODO: analytics stuff

		return link.url
	}
}
