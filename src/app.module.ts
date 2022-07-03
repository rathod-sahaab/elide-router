import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './api/auth/auth.module'
import { CONFIG_VALIDATION_SCHEMA } from './commons/constants'
import { LinkModule } from './api/link/link.module'
import { UserModule } from './api/user/user.module'
import { OrganisationModule } from './api/organisation/organisation.module'

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			// ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			validationSchema: CONFIG_VALIDATION_SCHEMA,
		}),
		LinkModule,
		UserModule,
		OrganisationModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
