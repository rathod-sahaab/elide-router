import { CookieSerializeOptions } from '@fastify/cookie'
import { Body, Controller, Delete, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from 'src/data/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { FastifyReply, FastifyRequest } from '../../commons/types/fastify'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private configService: ConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any, @Res() res: FastifyReply) {
		const { accessToken, refreshToken } = await this.authService.login(req.user)

		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')

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
	async profile(@Req() req: FastifyRequest) {
		return req.user
	}

	// TODO: make this RefreshToken only route, can't be accessed with just a accessToken
	@Delete('logout')
	@UseGuards(RefreshAuthGuard)
	async logout(@Res() res: FastifyReply) {
		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')
		await this.authService.deleteRefreshToken(res.cookie[refreshTokenCookieName])

		res.clearCookie(accessTokenCookieName).clearCookie(refreshTokenCookieName).status(200).send({
			message: 'Logout successful',
		})
	}
}
