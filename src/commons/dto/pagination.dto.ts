import { Min } from 'class-validator'

export class PaginationQuery {
	@Min(0)
	offset: number

	@Min(1)
	limit: number
}

export class PaginationArgs {
	offset: number
	limit: number
}
