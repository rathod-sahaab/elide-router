import { CookieSerializeOptions } from '@fastify/cookie'
import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from 'src/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { FastifyReply } from './interfaces/fastify'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private configService: ConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any, @Res() res: FastifyReply) {
		const { accessToken, refreshToken } = await this.authService.login(req.user)

		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')

		console.log(accessTokenCookieName, refreshTokenCookieName)

		const cookieOptions: CookieSerializeOptions = {
			httpOnly: true,
		}

		res.setCookie(accessTokenCookieName, accessToken, cookieOptions)
			.setCookie(refreshTokenCookieName, refreshToken, cookieOptions)
			.status(200)
			.send({
				message: 'Login successful',
			})
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
