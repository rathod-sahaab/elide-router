import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { FastifyRequest } from 'src/auth/interfaces/fastify'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { LinkRepository } from 'src/services/data/link.repository'
import { HelperService } from 'src/services/helper.service'
import { CreateLinkInputBody } from './dto/create-link.dto'

@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinkController {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly helperService: HelperService,
	) {}

	@Get()
	async getLinks(@Req() { user }: FastifyRequest, @Query() { page, limit }: PaginationQuery) {
		const { links, count } = await this.linkRepository.getUserLinks({
			userId: user.sub,
			page,
			limit,
		})

		return this.helperService.formatPaginationResponse({
			results: links,
			count,
			page,
			limit,
		})
	}

	@Post()
	async createLink(
		@Req() { user }: FastifyRequest,
		@Body() { slug, url, description, projectId, organisationId }: CreateLinkInputBody,
	) {
		return this.linkRepository.createLink({
			slug,
			url,
			description,
			creator: { connect: { id: user.sub } },
			project: { connect: { id: projectId } },
			organisation: { connect: { id: organisationId } },
		})
	}
}
