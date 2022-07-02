import { Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { LinkRepository } from 'src/services/data/link.repository'

@Injectable()
export class LinkService {
	constructor(private readonly linkRepository: LinkRepository) {}

	async getAllLinks({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.linkRepository.getUserLinks({
			userId,
			page,
			limit,
		})
	}
}
