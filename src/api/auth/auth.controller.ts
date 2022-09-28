import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common'
import { UserEntity } from 'src/data/entities/user.entity'
import { AuthService } from './auth.service'
import { RegisterBody } from './dto/register.dto'
import { JwtAuthGuard, RefreshAuthGuard } from './guards/jwt-auth.guard'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { FastifyReply, FastifyRequest, RefreshFastifyRequest } from 'src/commons/types/fastify'
import { DeleteSessionsBody } from './dto/delete-sessions.dto'
import { DeleteSessionParams } from './dto/delete-session.dto'
import { VerifyAccountBody } from './dto/verify-account.dto'
import { CookieService } from 'src/utils/cookie.service'

@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService, private readonly cookieService: CookieService) {}

	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Req() req: any, @Res({ passthrough: true }) res: FastifyReply) {
		const { accessToken, refreshToken, user } = await this.authService.login(req.user)

		const { accessTokenCookieName, accessTokenCookieOptions } =
			this.cookieService.getAccessTokenCookieOptions()
		const { refreshTokenCookieName, refreshTokenCookieOptions } =
			this.cookieService.getRefreshTokenCookieOptions()

		res.setCookie(accessTokenCookieName, accessToken, accessTokenCookieOptions)
		res.setCookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions)

		return { accessToken, user }
	}

	@Post('register')
	async register(@Body() { email, name, password }: RegisterBody): Promise<UserEntity> {
		return await this.authService.register({ email, name, password })
	}

	@Get('refresh')
	@UseGuards(RefreshAuthGuard)
	async refresh(@Req() req: RefreshFastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
		const { accessTokenCookieName, accessTokenCookieOptions } =
			this.cookieService.getAccessTokenCookieOptions()
		const { refreshTokenCookieName, refreshTokenCookieOptions } =
			this.cookieService.getRefreshTokenCookieOptions()

		const refreshTokenCookie = req.cookies[refreshTokenCookieName]

		const { accessToken, refreshToken, user } = await this.authService.refresh({
			refreshTokenCookie,
		})

		res.setCookie(accessTokenCookieName, accessToken, accessTokenCookieOptions)
		res.setCookie(refreshTokenCookieName, refreshToken, refreshTokenCookieOptions)

		return { accessToken, user }
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
		return this.authService.deleteSessions({ userId: user.sub, password })
	}

	@Delete('session/:sessionId')
	@UseGuards(RefreshAuthGuard)
	async deleteSession(
		@Req() { user }: RefreshFastifyRequest,
		@Param() { sessionId }: DeleteSessionParams,
		@Body() { password }: { password: string },
	) {
		return this.authService.deleteSession({
			userId: user.sub,
			sessionId,
			password,
		})
	}

	@Delete('logout')
	@UseGuards(RefreshAuthGuard)
	async logout(@Req() req: RefreshFastifyRequest, @Res({ passthrough: true }) res: FastifyReply) {
		const { accessTokenCookieName, accessTokenCookieOptions } =
			this.cookieService.getAccessTokenCookieOptions()
		const { refreshTokenCookieName, refreshTokenCookieOptions } =
			this.cookieService.getRefreshTokenCookieOptions()

		await this.authService.deleteRefreshToken(req.cookies[refreshTokenCookieName])

		res.clearCookie(accessTokenCookieName, accessTokenCookieOptions)
		res.clearCookie(refreshTokenCookieName, refreshTokenCookieOptions)

		return {
			message: 'Logout Successful',
		}
	}

	@Post('forgot-password')
	async forgotPassword(@Body() { email }: { email: string }) {
		return this.authService.forgotPassword({ email })
	}

	@Post('reset-password')
	async resetPassword(@Body() { token, password }: { token: string; password: string }) {
		return this.authService.resetPassword({ token, password })
	}

	@Post('verification')
	async verifyAccount(@Body() { token }: VerifyAccountBody) {
		const response = await this.authService.verifyAccount(token)
		return new UserEntity(response)
	}
}
