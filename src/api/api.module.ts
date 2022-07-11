import { Module } from '@nestjs/common'
import { RepositoriesModule } from 'src/data/repositories/repositories.module'
import { AuthModule } from './auth/auth.module'
import { LinkModule } from './link/link.module'
import { OrganisationModule } from './organisation/organisation.module'
import { ProjectModule } from './project/project.module'
import { UserModule } from './user/user.module'

@Module({
	imports: [
		OrganisationModule,
		AuthModule,
		LinkModule,
		UserModule,
		ProjectModule,
		RepositoriesModule,
	],
})
export class ApiModule {}
