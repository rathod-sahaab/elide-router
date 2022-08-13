import { IsJWT } from 'class-validator'

export class VerifyAccountBody {
	@IsJWT()
	token: string
}
