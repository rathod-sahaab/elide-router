import { IsBoolean, IsOptional, IsString, IsUrl, Matches, Min } from 'class-validator'
import { SLUG_REGEX } from 'src/commons/constants'

export class CreateLinkInputBody {
	@Matches(SLUG_REGEX, {
		message: 'Slug can only contain alphanumeric characters, dashes and underscores.',
	})
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
