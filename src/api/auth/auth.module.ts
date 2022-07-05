import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserRepository } from 'src/data/repositories/user.repository'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from 'src/data/repositories/prisma.service'
import { CryptoService } from 'src/utils/crypto.service'
import { JwtStrategy } from './strategies/jwt.strategy'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'

@Module({
	imports: [
		PassportModule,
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
	providers: [
		AuthService,
		UserRepository,
		RefreshTokenRepository,
		PrismaService,
		CryptoService,
		LocalStrategy,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
