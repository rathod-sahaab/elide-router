import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { OrganisationMemberRole } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class OrganisationRepository {
	constructor(private readonly prisma: PrismaService) {}

	async getUserOrganisations({ userId }: { userId: number }) {
		const orgRelations = await this.prisma.usersOnOrganisations.findMany({
			where: {
				userId,
			},
			include: {
				organisation: true,
			},
		})

		// TODO: move this presentation(not sure) logic to a better place
		return orgRelations.map((relation) => ({
			role: relation.role,
			organisation: relation.organisation,
		}))
	}

	async getLinks({ organisationId }: { organisationId: number }) {
		return this.prisma.link.findMany({
			where: {
				organisationId,
			},
		})
	}
	async getProjects({ organisationId }: { organisationId: number }) {
		return this.prisma.project.findMany({
			where: {
				organisationId,
			},
		})
	}

	async createOrganisation({
		userId,
		name,
		description,
	}: {
		userId: number
		name: string
		description?: string
	}) {
		// FIXME: Add transactions
		const organisation = await this.prisma.organisation.create({
			data: {
				name,
				description,
			},
		})

		if (!organisation) {
			throw new InternalServerErrorException('Organisation creation failed')
		}

		const orgRelation = this.prisma.usersOnOrganisations.create({
			data: {
				userId,
				organisationId: organisation.id,
				// Creator is ADMIN
				role: OrganisationMemberRole.ADMIN,
			},
		})

		if (!orgRelation) {
			throw new InternalServerErrorException('Organisation relation creation failed')
		}

		return organisation
	}
}
