import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator'

export class RegisterBody {
	@IsEmail()
	email: string

	@IsString()
	@MinLength(6)
	password: string

	@IsString()
	@IsNotEmpty()
	@MaxLength(30)
	name: string
}
