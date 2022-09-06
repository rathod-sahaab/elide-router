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
import { BullModule } from '@nestjs/bull'
import { VISITS_QUEUE } from './commons/types/queues'
import { HealthModule } from './api/health/health.module'
import { MongooseModule } from '@nestjs/mongoose'

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
			}),
			inject: [ConfigService],
			isGlobal: true,
		}),
		BullModule.forRootAsync({
			useFactory: async (configService: ConfigService) => ({
				redis: {
					host: configService.get('BULL_REDIS_HOST'),
					port: +configService.get('BULL_REDIS_PORT'),
					db: +configService.get('BULL_REDIS_DB'),
				},
			}),
			inject: [ConfigService],
		}),
		BullModule.registerQueue({
			name: VISITS_QUEUE,
		}),
		MongooseModule.forRootAsync({
			useFactory: async (configService: ConfigService) => {
				console.log(
					configService.get<string>('MONGO_URI'),
					configService.get<string>('MONGO_DATABASE'),
				)
				return {
					uri: configService.get<string>('MONGO_URI'),
					dbName: configService.get<string>('MONGO_DATABASE'),
				}
			},
			inject: [ConfigService],
		}),
		ApiModule,
		RepositoriesModule,
		UtilsModule,
		HealthModule,
	],
	controllers: [AppController],
	providers: [AppService, HelperService, ElideMailService],
})
export class AppModule {}
