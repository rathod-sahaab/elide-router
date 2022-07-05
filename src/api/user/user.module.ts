import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { CryptoService } from 'src/utils/crypto.service'
import { RefreshTokenRepository } from 'src/data/repositories/refresh-token.repository'
import { UserRepository } from 'src/data/repositories/user.repository'
import { PrismaService } from 'src/data/repositories/prisma.service'
import { AuthModule } from '../auth/auth.module'
import { HelperService } from 'src/utils/helper.service'

@Module({
	providers: [
		UserService,
		CryptoService,
		RefreshTokenRepository,
		UserRepository,
		PrismaService,
		HelperService,
	],
	controllers: [UserController],
	imports: [AuthModule],
})
export class UserModule {}
