import {
	FastifyRequest as OriginalFastifyRequest,
	FastifyReply as OriginalFastifyReply,
} from 'fastify'
import { TokenPayload } from './token-payload'

export type FastifyRequest = OriginalFastifyRequest & {
	user: TokenPayload
}

export type FastifyReply = OriginalFastifyReply
