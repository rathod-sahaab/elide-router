import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { LinkRepository } from 'src/data/repositories/link.repository'
import { UserRepository } from 'src/data/repositories/user.repository'

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

		if (projectId) {
			if (this.userRepository.userCanCreateLinkInProject({ userId: creatorId, projectId })) {
				creatLinkData.project = { connect: { id: projectId } }
			} else {
				throw new ForbiddenException('You are not allowed to create links in this project')
			}
		} else if (organisationId) {
			if (
				this.userRepository.userCanCreateLinkInOrganisation({
					userId: creatorId,
					organisationId,
				})
			) {
				creatLinkData.organisation = { connect: { id: organisationId } }
			} else {
				throw new ForbiddenException('You are not allowed to create links in this organisation')
			}
		}

		return this.linkRepository.createLink(creatLinkData)
	}

	async deleteLink({ userId, id }: { userId: number; id: number }) {
		const link = await this.linkRepository.link({ id })
		if (!link) {
			throw new NotFoundException('Link not found')
		}

		// TODO: project/org based permissions
		if (link.creatorId !== userId) {
			throw new ForbiddenException('You are not allowed to delete this link')
		}

		return this.linkRepository.deleteLink({
			id,
		})
	}
}
