import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/api/auth/guards/jwt-auth.guard'
import { FastifyRequest } from 'src/commons/types/fastify.d'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { CreateLinkInputBody } from './dto/create-link.dto'
import { DeleteLinkParams } from './dto/delete-link.dto'
import { LinkService } from './link.service'
import { GetSlugAvailabilityParams } from './dto/get-slug-availability.dto'
import { GetLinkParams } from './dto/get-link.dto'
import { UpdateLinkBody, UpdateLinkParams } from './dto/update-link.dto'
import { VerifiedAccountGuard } from '../auth/guards/verified.guard'

@Controller('api/links')
@UseGuards(JwtAuthGuard)
export class LinkController {
	constructor(private readonly linkService: LinkService) {}

	@Get()
	async getLinks(@Req() { user }: FastifyRequest, @Query() { offset, limit }: PaginationQuery) {
		return this.linkService.getUserLinks({
			userId: user.sub,
			offset,
			limit,
		})
	}

	@Get(':linkId')
	async getLink(@Req() { user }: FastifyRequest, @Param() { linkId }: GetLinkParams) {
		return this.linkService.getLink({ userId: user.sub, linkId })
	}

	@Get('slug/:slug/availability')
	async getSlugAvailability(@Param() { slug }: GetSlugAvailabilityParams) {
		if (slug === 'api') {
			// slug 'api' will always be unavailable as we use it for the API routes
			return {
				available: false,
			}
		}
		const available = await this.linkService.getSlugAvailability(slug)
		return {
			available,
		}
	}

	@Post()
	@UseGuards(VerifiedAccountGuard)
	async createLink(
		@Req() { user }: FastifyRequest,
		@Body() { slug, url, description, active, projectId, organisationId }: CreateLinkInputBody,
	) {
		return this.linkService.createLink({
			creatorId: user.sub,
			slug,
			url,
			active,
			description,
			projectId,
			organisationId,
		})
	}

	@Patch(':linkId')
	@UseGuards(VerifiedAccountGuard)
	async updateLink(
		@Req() { user }: FastifyRequest,
		@Param() { linkId }: UpdateLinkParams,
		@Body() { url, description, active }: UpdateLinkBody,
	) {
		return this.linkService.updateLink({
			userId: user.sub,
			id: linkId,
			url,
			description,
			active,
		})
	}

	@Delete(':linkId')
	@UseGuards(VerifiedAccountGuard)
	async deleteLink(@Req() { user }: FastifyRequest, @Param() { linkId }: DeleteLinkParams) {
		return this.linkService.deleteLink({
			userId: user.sub,
			id: linkId,
		})
	}
}
