import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common'
import { UserEntity } from 'src/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any) {
		return this.authService.login(req.user)
	}

	@Post('register')
	async register(@Body() { email, name, password }: RegisterBody): Promise<UserEntity> {
		return await this.authService.register({ email, name, password })
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async profile(@Req() req: any) {
		return await req.user
	}

	// TODO: remove once class transformers are fixed
	@Get('email/:email')
	async test_get_user(@Param('email') email: string): Promise<UserEntity> {
		return await this.authService.test_get_user(email)
	}
}
