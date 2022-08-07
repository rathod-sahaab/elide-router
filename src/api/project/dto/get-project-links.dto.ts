import { IsInt, Min } from 'class-validator'

export class GetProjectLinksParams {
	@IsInt()
	@Min(1)
	id: number
}
