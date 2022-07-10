import { IsNotEmpty, IsString } from 'class-validator'

export class DeleteInvitationParams {
	@IsNotEmpty()
	@IsString()
	invitationId: string
}
