import {
	FastifyRequest as OriginalFastifyRequest,
	FastifyReply as OriginalFastifyReply,
} from 'fastify'
import { RefreshTokenPayload, TokenPayload } from './token-payload'

export type FastifyRequest = OriginalFastifyRequest & {
	user: TokenPayload
}

export type RefreshFastifyRequest = OriginalFastifyRequest & {
	user: RefreshTokenPayload
}

export type FastifyReply = OriginalFastifyReply
