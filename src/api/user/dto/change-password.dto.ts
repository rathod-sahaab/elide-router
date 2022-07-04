import { IsString } from 'class-validator'

export class ChangePasswordDto {
	@IsString()
	password: string

	// TODO: Password regex validation for newPassword
	@IsString()
	newPassword: string
}
