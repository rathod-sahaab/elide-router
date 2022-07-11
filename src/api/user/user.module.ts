import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { AuthModule } from '../auth/auth.module'
import { JwtService } from '@nestjs/jwt'

@Module({
	providers: [UserService, JwtService],
	controllers: [UserController],
	imports: [AuthModule],
})
export class UserModule {}
