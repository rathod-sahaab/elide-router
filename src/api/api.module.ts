import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { RepositoriesModule } from 'src/data/repositories/repositories.module'
import { AuthModule } from './auth/auth.module'
import { LinkModule } from './link/link.module'
import { OrganisationModule } from './organisation/organisation.module'
import { ProjectModule } from './project/project.module'
import { UserModule } from './user/user.module'
import { HealthModule } from './health/health.module'
import { AnalyticsModule } from './analytics/analytics.module'

@Module({
	imports: [
		OrganisationModule,
		AuthModule,
		LinkModule,
		UserModule,
		ProjectModule,
		RepositoriesModule,
		PassportModule,
		HealthModule,
		AnalyticsModule,
	],
})
export class ApiModule {}
