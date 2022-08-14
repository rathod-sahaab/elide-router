import { CacheModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CONFIG_VALIDATION_SCHEMA } from './commons/constants'
import { HelperService } from './utils/helper.service'
import { ApiModule } from './api/api.module'
import { UtilsModule } from './utils/utils.module'
import { RepositoriesModule } from './data/repositories/repositories.module'
import { ElideMailService } from './utils/mail.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			// ignoreEnvFile: true,
			isGlobal: true,
			cache: true,
			validationSchema: CONFIG_VALIDATION_SCHEMA,
		}),
		CacheModule.registerAsync({
			useFactory: async (configService: ConfigService) => ({
				max: +configService.get<number>('CACHE_MAX_ITEMS'), // testing only increase to a larger number
				ttl: 0,
				isGlobal: true,
			}),
			inject: [ConfigService],
		}),
		ApiModule,
		RepositoriesModule,
		UtilsModule,
	],
	controllers: [AppController],
	providers: [AppService, HelperService, ElideMailService],
})
export class AppModule {}
