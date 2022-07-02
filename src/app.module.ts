import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CONFIG_VALIDATION_SCHEMA } from './utils/config-validation-schema'
import { LinksModule } from './links/links.module';

@Module({
	imports: [
		AuthModule,
		ConfigModule.forRoot({
			// ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			validationSchema: CONFIG_VALIDATION_SCHEMA,
		}),
		LinksModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
