import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateProjectBody {
	@IsOptional()
	@IsInt()
	organisationId?: number

	@IsString()
	@IsNotEmpty()
	name: string

	@IsOptional()
	@IsString()
	@IsNotEmpty()
	description?: string
}
