import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator'

export class UpdateLinkParams {
	@Min(1)
	@IsInt()
	linkId: number
}

export class UpdateLinkBody {
	@IsUrl()
	@IsOptional()
	url?: string

	@IsString()
	@IsOptional()
	description?: string

	@IsBoolean()
	@IsOptional()
	active?: boolean
}
