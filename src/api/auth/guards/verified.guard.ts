import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common'
import { FastifyRequest } from 'src/commons/types/fastify'

@Injectable()
export class VerifiedAccountGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const { user } = context.switchToHttp().getRequest() as FastifyRequest
		if (!user) {
			throw new InternalServerErrorException('JWT should have been decoded')
		}

		if (!user.verified) {
			throw new ForbiddenException(
				'Your account must be verified before you can perform this action, please visit profile page.',
			)
		}

		return true
	}
}
