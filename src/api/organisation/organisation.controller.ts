import { Body, Controller, Delete, Get, Param, Post, Query, Req } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { AddMemberBody, AddMemberParams } from './dto/add-member.dto'
import { CancelInvitationParams } from './dto/cancel-organsisation-invitation.dto'
import { CreateOrganisationBody } from './dto/create-organisation.dto'
import { DeleteMemberParams } from './dto/delete-member.dto'
import { GetOrgLinksParams } from './dto/get-org-links.dto'
import { OrganisationService } from './organisation.service'

@Controller('organisations')
export class OrganisationController {
	constructor(private readonly organisationService: OrganisationService) {}

	@Get()
	getUserOrganisations(@Req() { user }: FastifyRequest) {
		return this.organisationService.getUserOrganisations({ userId: user.sub })
	}

	@Post()
	createOrganisation(@Req() { user }: FastifyRequest, @Body() body: CreateOrganisationBody) {
		return this.organisationService.createOrganisation({ userId: user.sub, ...body })
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

	@Post(':orgId/invite')
	addMember(
		@Req() { user }: FastifyRequest,
		@Param() { orgId }: AddMemberParams,
		@Body() { memberEmail, role }: AddMemberBody,
	) {
		return this.organisationService.addMember({
			userId: user.sub,
			organisationId: orgId,
			memberEmail,
			role,
		})
	}

	@Delete(':orgId/member/:memberId')
	deleteMember(@Req() { user }: FastifyRequest, @Param() { orgId, memberId }: DeleteMemberParams) {
		return this.organisationService.deleteMember({
			userId: user.sub,
			organisationId: orgId,
			memberId,
		})
	}

	@Get(':orgId/invitations')
	async getOrgInvitations(
		@Req() { user }: FastifyRequest,
		@Param() { orgId }: GetOrgLinksParams,
		@Query() { offset, limit }: PaginationArgs,
	) {
		return this.organisationService.getOrganisationInvitations({
			userId: user.sub,
			organisationId: orgId,
			offset,
			limit,
		})
	}

	@Delete(':orgId/invitation/:invitationId')
	async cancelOrganisationInvitation(
		@Req() { user }: FastifyRequest,
		@Param() { orgId, invitationId }: CancelInvitationParams,
	) {
		return this.organisationService.cancelInvitation({
			userId: user.sub,
			organisationId: orgId,
			invitationId,
		})
	}
}
