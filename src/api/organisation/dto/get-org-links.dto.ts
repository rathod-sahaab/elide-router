import { IsInt } from 'class-validator'

export class GetOrgLinksParams {
	@IsInt()
	orgId: number
}
