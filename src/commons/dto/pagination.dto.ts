import { Min } from 'class-validator'

export class PaginationQuery {
	@Min(1)
	page: number

	@Min(1)
	limit: number
}

export class PaginationArgs {
	page: number
	limit: number
}
