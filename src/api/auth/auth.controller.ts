import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from 'src/data/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { FastifyReply, FastifyRequest, RefreshFastifyRequest } from 'src/commons/types/fastify'
import { ACCESS_TOKEN_COOKIE_OPTIONS, REFRESH_TOKEN_COOKIE_OPTIONS } from 'src/commons/constants'
import { DeleteSessionsBody } from './dto/delete-sessions.dto'
import { DeleteSessionParams } from './dto/delete-session.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private configService: ConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any, @Res() res: FastifyReply) {
		const { accessToken, refreshToken } = await this.authService.login(req.user)

		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')

		res.setCookie(accessTokenCookieName, accessToken, ACCESS_TOKEN_COOKIE_OPTIONS)
			.setCookie(refreshTokenCookieName, refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS)
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

	@Delete('sessions')
	@UseGuards(RefreshAuthGuard)
	async deleteSessions(
		@Req() { user }: RefreshFastifyRequest,
		@Body() { password }: DeleteSessionsBody,
	) {
		return this.authService.deleteSessions({ userId: user.accessTokenPayload.sub, password })
	}

	@Delete('session/:sessionId')
	@UseGuards(RefreshAuthGuard)
	async deleteSession(
		@Req() { user }: RefreshFastifyRequest,
		@Param() { sessionId }: DeleteSessionParams,
		@Body() { password }: { password: string },
	) {
		return this.authService.deleteSession({
			userId: user.accessTokenPayload.sub,
			sessionId,
			password,
		})
	}

	// TODO: make this RefreshToken only route, can't be accessed with just a accessToken
	@Delete('logout')
	@UseGuards(RefreshAuthGuard)
	async logout(@Req() req: RefreshFastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')

		await this.authService.deleteRefreshToken(req.cookies[refreshTokenCookieName])

		res.clearCookie(accessTokenCookieName, ACCESS_TOKEN_COOKIE_OPTIONS)
		res.clearCookie(refreshTokenCookieName, REFRESH_TOKEN_COOKIE_OPTIONS)

		return {
			message: 'Logout Successful',
		}
	}
}
