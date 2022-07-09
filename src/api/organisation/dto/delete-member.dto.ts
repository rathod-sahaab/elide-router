import { IsInt, Min } from 'class-validator'

export class DeleteMemberParams {
	@IsInt()
	@Min(1)
	orgId: number

	@IsInt()
	@Min(1)
	memberId: number
}
