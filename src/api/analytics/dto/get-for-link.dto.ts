import { IsInt, IsOptional, Max, Min } from 'class-validator'

export class GetForLinkParams {
	@IsInt()
	@Min(1)
	linkId: number
}

export class GetForLinkQuery {
	@IsInt()
	@Max(720)
	@IsOptional()
	startHrs?: number

	@IsInt()
	@Min(0)
	@IsOptional()
	endHrs?: number
}
