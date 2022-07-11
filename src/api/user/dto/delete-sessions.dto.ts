import { IsString } from 'class-validator'

export class DeleteSessionsBody {
	@IsString()
	password: string
}
