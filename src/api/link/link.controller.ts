import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard'
import { FastifyRequest } from 'src/commons/types/fastify.d'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { HelperService } from 'src/utils/helper.service'
import { CreateLinkInputBody } from './dto/create-link.dto'
import { DeleteLinkParams } from './dto/delete-link.dto'
import { LinkService } from './link.service'

@Controller('links')
@UseGuards(JwtAuthGuard)
export class LinkController {
	constructor(
		private readonly linkService: LinkService,
		private readonly helperService: HelperService,
	) {}

	@Get()
	async getLinks(@Req() { user }: FastifyRequest, @Query() { page, limit }: PaginationQuery) {
		const { links, count } = await this.linkService.getUserLinks({
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
		return this.linkService.createLink({
			creatorId: user.sub,
			slug,
			url,
			description,
			projectId,
			organisationId,
		})
	}

	@Delete(':linkId')
	async deleteLink(@Req() { user }: FastifyRequest, @Param() { linkId }: DeleteLinkParams) {
		return this.linkService.deleteLink({
			userId: user.sub,
			id: linkId,
		})
	}
}
