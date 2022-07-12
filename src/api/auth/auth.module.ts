import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { JwtStrategy, RefreshJwtStrategy } from './strategies/jwt.strategy'

@Module({
	imports: [
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => {
				return {
					secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
					signOptions: {
						expiresIn: config.get<string>('JWT_ACCESS_TOKEN_VALIDITY'),
					},
				}
			},
			inject: [ConfigService],
		}),
	],
	providers: [AuthService, LocalStrategy, JwtStrategy, RefreshJwtStrategy],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
