import { Controller, Get, Req } from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'
import { OrganisationService } from './organisation.service'

@Controller('organisation')
export class OrganisationController {
	constructor(private readonly organisationService: OrganisationService) {}

	@Get()
	getUserOrganisations(@Req() { user }: FastifyRequest) {
		return this.organisationService.getUserOrganisations({ userId: user.sub })
	}
}
