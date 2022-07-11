import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CONFIG_VALIDATION_SCHEMA } from './commons/constants'
import { HelperService } from './utils/helper.service'
import { ApiModule } from './api/api.module'
import { UtilsModule } from './utils/utils.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			// ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			validationSchema: CONFIG_VALIDATION_SCHEMA,
		}),
		ApiModule,
		UtilsModule,
	],
	controllers: [AppController],
	providers: [AppService, HelperService],
})
export class AppModule {}
