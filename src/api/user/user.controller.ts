import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	Req,
	UseGuards,
} from '@nestjs/common'
import { PaginationQuery } from 'src/commons/dto/pagination.dto'
import { FastifyRequest } from 'src/commons/types/fastify'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AcceptInvitationParams } from './dto/accept-invitation.dto'
import { ChangePasswordDto } from './dto/change-password.dto'
import { DeleteInvitationParams } from './dto/delete-invitation.dto'
import { UserService } from './user.service'

@Controller('api/users')
@UseGuards(JwtAuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('profile')
	getProfile(@Req() { user }: FastifyRequest) {
		return this.userService.getProfile(user.sub)
	}

	@Post('verification')
	async sendVerificationEmail(@Req() { user }: FastifyRequest) {
		return this.userService.sendVerificationEmail(user.sub)
	}

	@Post('password')
	async changePassword(
		@Req() { user }: FastifyRequest,
		@Body() { password, newPassword }: ChangePasswordDto,
	) {
		return this.userService.changePassword({ userId: user.sub, password, newPassword })
	}

	@Get('invitations')
	getInvitations(@Req() { user }: FastifyRequest, @Query() { offset, limit }: PaginationQuery) {
		return this.userService.getInvitations({ userId: user.sub, offset, limit })
	}

	@Get('invitations/count')
	async getPendingInvitationsCount(@Req() { user }: FastifyRequest) {
		const count = await this.userService.getPendingInvitationsCount({ userId: user.sub })
		return { count }
	}

	@Put('invitations/:invitationId')
	acceptInvitation(
		@Req() { user }: FastifyRequest,
		@Param() { invitationId }: AcceptInvitationParams,
	) {
		return this.userService.acceptInvitation({ userId: user.sub, invitationId })
	}

	@Delete('invitations/:invitationId')
	rejectInvitation(
		@Req() { user }: FastifyRequest,
		@Param() { invitationId }: DeleteInvitationParams,
	) {
		return this.userService.rejectInvitation({ userId: user.sub, invitationId })
	}
}
