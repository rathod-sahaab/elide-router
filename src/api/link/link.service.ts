import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { OrganisationMemberRole, Prisma } from '@prisma/client'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { LinkRepository } from 'src/data/repositories/link.repository'
import { ProjectRepository } from 'src/data/repositories/project.repository'
import { UserOrganisationRepository } from 'src/data/repositories/user-on-organisation.repository'
import { UserRepository } from 'src/data/repositories/user.repository'

@Injectable()
export class LinkService {
	constructor(
		private readonly linkRepository: LinkRepository,
		private readonly userRepository: UserRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly usersOnOrganisations: UserOrganisationRepository,
	) {}

	async getLink({ linkId, userId }: { userId: number; linkId: number }) {
		const link = await this.linkRepository.link({ id: linkId })

		if (!link) {
			throw new NotFoundException('Link not found')
		}

		if (!(await this.userCanViewLink({ userId, linkId }))) {
			throw new ForbiddenException('User does not have permission to view this link.')
		}

		return link
	}

	async getUserLinks({ userId, offset, limit }: { userId: number } & PaginationArgs) {
		return this.linkRepository.getUserLinks({
			userId,
			offset,
			limit,
		})
	}

	async getSlugAvailability(slug: string): Promise<boolean> {
		const link = await this.linkRepository.linkBySlug({ slug })
		return !link
	}

	async createLink({
		slug,
		url,
		description,
		creatorId,
		active,
		projectId,
		organisationId,
	}: {
		slug: string
		url: string
		description: string
		creatorId: number
		active?: boolean
		projectId?: number
		organisationId?: number
	}) {
		const creatLinkData: Prisma.LinkCreateInput = {
			slug,
			url,
			description,
			active,
			creator: { connect: { id: creatorId } },
		}

		if (!(await this.getSlugAvailability(slug))) {
			throw new BadRequestException('Slug not available.')
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

	async updateLink({
		userId,
		id,
		url,
		description,
		active,
	}: {
		userId: number
		id: number
		url?: string
		description?: string
		active?: boolean
	}) {
		const link = await this.linkRepository.link({ id })

		if (!link) {
			throw new NotFoundException('Link not found.')
		}

		if (
			(link.projectId &&
				!(await this.userCanEditProjectLink({ projectId: link.projectId, userId }))) ||
			(link.organisationId &&
				!(await this.userCanEditOrganisationLink({
					organisationId: link.organisationId,
					userId,
				}))) ||
			(!link.projectId && !link.organisationId && link.creatorId !== userId)
		) {
			throw new ForbiddenException('User does not have permission to edit given link')
		}

		return this.linkRepository.updateLink({ id, url, description, active })
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

	private async userCanEditOrganisationLink({
		organisationId,
		userId,
	}: {
		organisationId: number
		userId: number
	}): Promise<boolean> {
		const orgRole = await this.usersOnOrganisations.getOrganisationRelation({
			organisationId,
			userId,
		})

		if (!orgRole) {
			return false
		}

		return (
			orgRole.role === OrganisationMemberRole.MAKER ||
			orgRole.role === OrganisationMemberRole.ADMIN
		)
	}

	private async userCanEditProjectLink({
		projectId,
		userId,
	}: {
		projectId: number
		userId: number
	}): Promise<boolean> {
		const project = await this.projectRepository.getProject({ projectId })

		if (!project) {
			throw new NotFoundException('Project not found')
		}

		if (project.organisationId) {
			return await this.userCanEditOrganisationLink({
				userId,
				organisationId: project.organisationId,
			})
		}

		return project.ownerId === userId
	}

	private async userCanViewOrganisationLink({
		organisationId,
		userId,
	}: {
		organisationId: number
		userId: number
	}): Promise<boolean> {
		const orgRole = await this.usersOnOrganisations.getOrganisationRelation({
			organisationId,
			userId,
		})

		return !!orgRole
	}

	private async userCanViewProjectLink({
		projectId,
		userId,
	}: {
		projectId: number
		userId: number
	}): Promise<boolean> {
		const project = await this.projectRepository.getProject({ projectId })

		if (!project) {
			throw new NotFoundException('Project not found')
		}

		if (project.organisationId) {
			return await this.userCanViewOrganisationLink({
				userId,
				organisationId: project.organisationId,
			})
		}

		return project.ownerId === userId
	}

	private async userCanViewLink({
		userId,
		linkId,
	}: {
		userId: number
		linkId: number
	}): Promise<boolean> {
		const link = await this.linkRepository.link({ id: linkId })

		if (!link) {
			throw new NotFoundException('Link not found')
		}

		if (link.projectId) {
			return await this.userCanViewProjectLink({ userId, projectId: link.projectId })
		}

		if (link.organisationId) {
			return await this.userCanViewOrganisationLink({
				userId,
				organisationId: link.organisationId,
			})
		}

		return link.creatorId === userId
	}
}
