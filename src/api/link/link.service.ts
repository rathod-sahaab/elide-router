import {
	BadRequestException,
	CACHE_MANAGER,
	ForbiddenException,
	Inject,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Link, OrganisationMemberRole, Project } from '@prisma/client'
import { Cache } from 'cache-manager'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { getLinkCacheKey } from 'src/commons/functions/cache-keys'
import { LinkRepository } from 'src/data/repositories/link.repository'
import { ProjectRepository } from 'src/data/repositories/project.repository'
import { UserOrganisationRepository } from 'src/data/repositories/user-on-organisation.repository'

@Injectable()
export class LinkService {
	constructor(
		// repositories
		private readonly linkRepository: LinkRepository,
		private readonly projectRepository: ProjectRepository,
		private readonly usersOnOrganisations: UserOrganisationRepository,

		// services
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
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
		if (!(await this.getSlugAvailability(slug))) {
			throw new BadRequestException('Slug not available.')
		}

		if (projectId) {
			const project = await this.projectRepository.getProject({ projectId })

			if (!project) {
				throw new NotFoundException(`Project with id ${projectId} not found`)
			}

			if (!(await this.userCanCreateLinkInProject({ userId: creatorId, project }))) {
				throw new ForbiddenException('You are not allowed to create links in this project')
			}

			// TODO: Look for non mutating approach
			organisationId = project.organisationId
		} else if (organisationId) {
			if (
				!(await this.userCanCreateLinkInOrganisation({
					userId: creatorId,
					organisationId,
				}))
			) {
				throw new ForbiddenException('You are not allowed to create links in this organisation')
			}
		}

		return this.linkRepository.createLink({
			slug,
			url,
			description,
			creatorId,
			active,
			projectId,
			organisationId,
		})
	}

	// only update link in cache if exists
	private async updateLinkInCacheAside(link: Link): Promise<void> {
		const key = getLinkCacheKey(link.slug)
		const oldCachedValue = this.cacheManager.get(getLinkCacheKey(key))

		if (oldCachedValue) {
			this.cacheManager.set(key, link)
		}
	}

	private async deleteLinkInCacheAside(slug: string): Promise<void> {
		return this.cacheManager.del(getLinkCacheKey(slug))
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

		if (!this.userCanEditLink({ link, userId })) {
			throw new ForbiddenException('User does not have permission to edit given link')
		}

		const updatedLink = await this.linkRepository.updateLink({ id, url, description, active })

		await this.updateLinkInCacheAside(updatedLink)

		return updatedLink
	}

	async deleteLink({ userId, id }: { userId: number; id: number }) {
		const link = await this.linkRepository.link({ id })
		if (!link) {
			throw new NotFoundException('Link not found')
		}

		if (this.userCanEditLink({ link, userId })) {
			throw new ForbiddenException('You are not allowed to delete this link')
		}

		await this.deleteLinkInCacheAside(link.slug)

		return this.linkRepository.deleteLink({
			id,
		})
	}

	private async userCanEditLink({
		link,
		userId,
	}: {
		link: Link
		userId: number
	}): Promise<boolean> {
		if (link.organisationId) {
			return await this.userCanEditOrganisationLink({
				organisationId: link.organisationId,
				userId,
			})
		}
		link.creatorId !== userId
	}

	private userCanCreateLinkInOrganisation({ organisationId, userId }): Promise<boolean> {
		return this.userCanEditOrganisationLink({ userId, organisationId })
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

	async userCanViewLink({ userId, linkId }: { userId: number; linkId: number }): Promise<boolean> {
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

	private async userCanCreateLinkInProject({
		userId,
		project,
	}: {
		project: Project
		userId: number
	}) {
		if (project.ownerId === userId) {
			return true
		}

		if (project.organisationId) {
			const orgRole = await this.usersOnOrganisations.getOrganisationRelation({
				organisationId: project.organisationId,
				userId,
			})

			return (
				orgRole.role === OrganisationMemberRole.MAKER ||
				orgRole.role === OrganisationMemberRole.ADMIN
			)
		}

		return false
	}
}
