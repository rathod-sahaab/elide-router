import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AddMemberBody, AddMemberParams } from './dto/add-member.dto'
import { CancelInvitationParams } from './dto/cancel-organsisation-invitation.dto'
import { CreateOrganisationBody } from './dto/create-organisation.dto'
import { DeleteMemberParams } from './dto/delete-member.dto'
import { GetOrgInvitationsQuery } from './dto/get-org-invitations.dto'
import { GetOrgLinksParams } from './dto/get-org-links.dto'
import { OrganisationService } from './organisation.service'

@Controller('api/organisations')
@UseGuards(JwtAuthGuard)
export class OrganisationController {
	constructor(private readonly organisationService: OrganisationService) {}

	@Get()
	getUserOrganisations(@Req() { user }: FastifyRequest) {
		return this.organisationService.getUserOrganisations({ userId: user.sub })
	}

	@Get(':orgId')
	getOrganisation(@Req() { user }: FastifyRequest, @Param() { orgId }: GetOrgLinksParams) {
		return this.organisationService.getOrganisation({
			userId: user.sub,
			organisationId: orgId,
		})
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

	@Get(':orgId/members')
	getOrgMembers(
		@Req() { user }: FastifyRequest,
		@Param() { orgId }: GetOrgLinksParams,
		@Query() { offset, limit }: PaginationArgs,
	) {
		return this.organisationService.getOrganisationMembers({
			userId: user.sub,
			organisationId: orgId,
			offset,
			limit,
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

	@Post(':orgId/invitations')
	createInvitation(
		@Req() { user }: FastifyRequest,
		@Param() { orgId }: AddMemberParams,
		@Body() { memberEmail, role }: AddMemberBody,
	) {
		return this.organisationService.createInvitation({
			userId: user.sub,
			organisationId: orgId,
			memberEmail,
			role,
		})
	}

	@Get(':orgId/invitations')
	async getOrgInvitations(
		@Req() { user }: FastifyRequest,
		@Param() { orgId }: GetOrgLinksParams,
		@Query() { offset, limit, status }: GetOrgInvitationsQuery,
	) {
		return this.organisationService.getOrganisationInvitations({
			userId: user.sub,
			organisationId: orgId,
			offset,
			limit,
			status,
		})
	}

	@Delete(':orgId/invitations/:invitationId')
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
