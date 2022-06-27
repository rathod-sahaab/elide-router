import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
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
	async register(@Body() { email, name, password }: RegisterBody) {
		return await this.authService.register({ email, name, password })
	}
}
