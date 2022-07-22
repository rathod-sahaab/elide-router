import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { UserEntity } from 'src/data/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { FastifyReply, FastifyRequest, RefreshFastifyRequest } from 'src/commons/types/fastify'
import { getAccessTokenCookieOptions, getRefreshTokenCookieOptions } from 'src/commons/constants'
import { DeleteSessionsBody } from './dto/delete-sessions.dto'
import { DeleteSessionParams } from './dto/delete-session.dto'

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService, private configService: ConfigService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply) {
		const { accessToken, refreshToken, user } = await this.authService.login(req.user)

		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')

		res.setCookie(accessTokenCookieName, accessToken, getAccessTokenCookieOptions()).setCookie(
			refreshTokenCookieName,
			refreshToken,
			getRefreshTokenCookieOptions(),
		)

		return user
	}

	@Post('register')
	async register(@Body() { email, name, password }: RegisterBody): Promise<UserEntity> {
		return await this.authService.register({ email, name, password })
	}

	@Get('refresh')
	@UseGuards(RefreshAuthGuard)
	async refresh(@Req() req: RefreshFastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
		const refreshTokenCookie =
			req.cookies[this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')]

		const { accessToken, refreshToken, user } = await this.authService.refresh({
			refreshTokenCookie,
		})

		const accessTokenCookieName = this.configService.get('JWT_ACCESS_TOKEN_COOKIE_NAME')
		const refreshTokenCookieName = this.configService.get('JWT_REFRESH_TOKEN_COOKIE_NAME')
		res.setCookie(accessTokenCookieName, accessToken, getAccessTokenCookieOptions()).setCookie(
			refreshTokenCookieName,
			refreshToken,
			getRefreshTokenCookieOptions(),
		)

		return user
	}

	@Get('profile')
	@UseGuards(JwtAuthGuard)
	async profile(@Req() req: FastifyRequest) {
		return req.user
	}

	@Get('sessions')
	@UseGuards(JwtAuthGuard)
	async getUserSessions(@Req() { user }: FastifyRequest) {
		return this.authService.getUserSessions({ userId: user.sub })
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

		res.clearCookie(accessTokenCookieName, getAccessTokenCookieOptions())
		res.clearCookie(refreshTokenCookieName, getRefreshTokenCookieOptions())

		return {
			message: 'Logout Successful',
		}
	}
}
