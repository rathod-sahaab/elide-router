import { Injectable } from '@nestjs/common'
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
}
