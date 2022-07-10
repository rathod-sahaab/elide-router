import { IsInt, IsNotEmpty, IsString } from 'class-validator'

export class CancelInvitationParams {
	@IsInt()
	orgId: number

	@IsString()
	@IsNotEmpty()
	invitationId: string
}
