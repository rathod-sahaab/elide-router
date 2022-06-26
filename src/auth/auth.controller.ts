import { Controller, Post, Req, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local-auth.guard'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any) {
		return this.authService.login(req.user)
	}
}
