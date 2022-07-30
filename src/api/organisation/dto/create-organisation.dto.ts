import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateOrganisationBody {
	@IsNotEmpty()
	name: string

	@IsNotEmpty()
	@IsOptional()
	description?: string
}
