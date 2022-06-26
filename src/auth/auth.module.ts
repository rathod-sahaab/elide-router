import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserService } from 'src/services/data/user.service'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'src/services/data/prisma.service'

@Module({
	imports: [
		PassportModule,
		JwtModule.registerAsync({
			useFactory: async (config: ConfigService) => ({
				secret: config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
				signOptions: {
					expiresIn: config.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'),
				},
			}),
			inject: [ConfigService],
		}),
	],
	providers: [AuthService, UserService, LocalStrategy, PrismaService],
	controllers: [AuthController],
})
export class AuthModule {}
