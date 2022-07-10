import { IsNotEmpty, IsString } from 'class-validator'

export class AcceptInvitationParams {
	@IsNotEmpty()
	@IsString()
	invitationId: string
}
