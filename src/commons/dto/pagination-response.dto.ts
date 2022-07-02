export interface PaginationResponse<T> {
	results: T[]
	page: number
	limit: number
	count: number
	totalPages: number
	nextPage: number
	prevPage: number
}
