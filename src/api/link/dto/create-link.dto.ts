import { IsBoolean, IsOptional, IsString, IsUrl, Min } from 'class-validator'

export class CreateLinkInputBody {
	@IsString()
	slug: string

	@IsUrl()
	url: string

	@IsString()
	@IsOptional()
	description?: string

	@IsBoolean()
	@IsOptional()
	active?: boolean

	@IsOptional()
	@Min(1)
	projectId?: number

	@IsOptional()
	@Min(1)
	organisationId?: number
}
