import { IsInt, Min } from 'class-validator'

export class GetLinkParams {
	@IsInt()
	@Min(1)
	linkId: number
}
