import { Global, Module } from '@nestjs/common'
import { LinkRepository } from './link.repository'
import { OrganisationInvitationRepository } from './organisation-invitations.repository'
import { OrganisationRepository } from './organisation.repository'
import { PrismaService } from './prisma.service'
import { ProjectRepository } from './project.repository'
import { RefreshTokenRepository } from './refresh-token.repository'
import { UserOrganisationRepository } from './user-on-organisation.repository'
import { UserRepository } from './user.repository'

@Global()
@Module({
	providers: [
		LinkRepository,
		OrganisationInvitationRepository,
		OrganisationRepository,
		PrismaService,
		ProjectRepository,
		RefreshTokenRepository,
		UserOrganisationRepository,
		UserRepository,
	],
	exports: [
		LinkRepository,
		OrganisationInvitationRepository,
		OrganisationRepository,
		PrismaService,
		ProjectRepository,
		RefreshTokenRepository,
		UserOrganisationRepository,
		UserRepository,
	],
})
export class RepositoriesModule {}
