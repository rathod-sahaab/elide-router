import { IsNotEmpty } from 'class-validator'

export class GetSlugAvailabilityParams {
	@IsNotEmpty()
	slug: string
}
