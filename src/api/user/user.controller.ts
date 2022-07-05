import { Body, Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { ChangePasswordDto } from './dto/change-password.dto'
import { UserService } from './user.service'

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	getProfile(@Req() { user }: FastifyRequest) {
		return this.userService.getProfile(user.sub)
	}

	@Post('password')
	async changePassword(
		@Req() { user }: FastifyRequest,
		@Body() { password, newPassword }: ChangePasswordDto,
	) {
		return this.userService.changePassword({ userId: user.sub, password, newPassword })
	}

	@Delete('sessions')
	async deleteSessions(
		@Req() { user }: FastifyRequest,
		@Body() { password }: { password: string },
	) {
		return this.userService.deleteSessions({ userId: user.sub, password })
	}

	// @Delete('session/:sessionId')
	// async deleteSession(@Req() { user }: FastifyRequest, @Param('sessionId') sessionId: string) {}
}
