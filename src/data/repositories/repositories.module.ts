import { Global, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Visit, VisitSchema } from 'src/data/entities/visit.model'
import { LinkRepository } from './link.repository'
import { OrganisationInvitationRepository } from './organisation-invitations.repository'
import { OrganisationRepository } from './organisation.repository'
import { PrismaService } from './prisma.service'
import { ProjectRepository } from './project.repository'
import { RefreshTokenRepository } from './refresh-token.repository'
import { UserOrganisationRepository } from './user-on-organisation.repository'
import { UserRepository } from './user.repository'
import { VisitsRepository } from './visit.repository'

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: Visit.name,
				schema: VisitSchema,
			},
		]),
	],
	providers: [
		LinkRepository,
		OrganisationInvitationRepository,
		OrganisationRepository,
		PrismaService,
		ProjectRepository,
		RefreshTokenRepository,
		UserOrganisationRepository,
		UserRepository,
		VisitsRepository,
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
		VisitsRepository,
	],
})
export class RepositoriesModule {}
