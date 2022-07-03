import { Injectable } from '@nestjs/common'
import { PaginationArgs } from 'src/commons/dto/pagination.dto'
import { PaginationResponse } from 'src/commons/dto/pagination-response.dto'

@Injectable()
export class HelperService {
	formatPaginationResponse<T>({
		results,
		count,
		page,
		limit,
	}: {
		results: T[]
		count: number
	} & PaginationArgs): PaginationResponse<T> {
		const totalPages = Math.ceil(count / limit)
		const nextPage = page < totalPages ? page + 1 : null
		const prevPage = page > 1 ? page - 1 : null

		return {
			results,
			page,
			limit,
			count,
			totalPages,
			nextPage,
			prevPage,
		}
	}
}
