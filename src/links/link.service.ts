import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { LinkRepository } from 'src/services/data/link.repository'
import { UserRepository } from 'src/services/data/user.repository'

@Injectable()
export class LinkService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly userRepository: UserRepository,
	) {}

	async getUserLinks({ userId, page, limit }: { userId: number } & PaginationArgs) {
		return this.linkRepository.getUserLinks({
			userId,
			page,
			limit,
		})
	}
	async createLink({
		slug,
		url,
		description,
		creatorId,
		projectId,
		organisationId,
	}: {
		slug: string
		url: string
		description: string
		creatorId: number
		projectId?: number
		organisationId?: number
	}) {
		const creatLinkData: Prisma.LinkCreateInput = {
			slug,
			url,
			description,
			creator: { connect: { id: creatorId } },
		}

		if (
			projectId &&
			this.userRepository.userCanCreateLinkInProject({ userId: creatorId, projectId })
		) {
			creatLinkData.project = { connect: { id: projectId } }
		} else if (
			organisationId &&
			this.userRepository.userCanCreateLinkInOrganisation({ userId: creatorId, organisationId })
		) {
			creatLinkData.organisation = { connect: { id: organisationId } }
		}

		return this.linkRepository.createLink(creatLinkData)
	}
}
