import { Controller, Get, Param, Req } from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'
import { GetOrgLinksParams } from './dto/get-org-links.dto'
import { OrganisationService } from './organisation.service'

@Controller('organisation')
export class OrganisationController {
	constructor(private readonly organisationService: OrganisationService) {}

	@Get()
	getUserOrganisations(@Req() { user }: FastifyRequest) {
		return this.organisationService.getUserOrganisations({ userId: user.sub })
	}

	@Get(':orgId/links')
	getOrgLinks(@Req() { user }: FastifyRequest, @Param() { orgId }: GetOrgLinksParams) {
		return this.organisationService.getOrganisationLinks({
			userId: user.sub,
			organisationId: orgId,
		})
	}

	@Get(':orgId/projects')
	getOrgProjects(@Req() { user }: FastifyRequest, @Param() { orgId }: GetOrgLinksParams) {
		return this.organisationService.getOrganisationProjects({
			userId: user.sub,
			organisationId: orgId,
		})
	}
}
