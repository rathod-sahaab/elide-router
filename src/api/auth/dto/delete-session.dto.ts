import { IsString } from 'class-validator'

export class DeleteSessionParams {
	// TODO: check for cuid
	@IsString()
	sessionId: string
}
