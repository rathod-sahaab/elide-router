import { OrganisationInvitationStatus } from '@prisma/client'
import { IsIn, IsOptional } from 'class-validator'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'

export class GetOrgInvitationsQuery extends PaginationArgs {
	@IsIn(Object.keys(OrganisationInvitationStatus))
	@IsOptional()
	status?: OrganisationInvitationStatus
}
