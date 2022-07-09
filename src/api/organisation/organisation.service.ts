import { Injectable, UnauthorizedException } from '@nestjs/common'
import { OrganisationRepository } from 'src/data/repositories/organisation.repository'
import { UserRepository } from 'src/data/repositories/user.repository'

@Injectable()
export class OrganisationService {
	constructor(
		private readonly organisationRepository: OrganisationRepository,
		private readonly userRepository: UserRepository,
	) {}

	getUserOrganisations({ userId }: { userId: number }) {
		this.organisationRepository.getUserOrganisations({ userId })
	}

	getOrganisationLinks({ userId, organisationId }: { userId: number; organisationId: number }) {
		if (!this.userRepository.userCanViewInOrganisation({ userId, organisationId })) {
			throw new UnauthorizedException("You don't have permission to view this organisation")
		}
		return this.organisationRepository.getLinks({ organisationId })
	}

	getOrganisationProjects({ userId, organisationId }: { userId: number; organisationId: number }) {
		if (!this.userRepository.userCanViewInOrganisation({ userId, organisationId })) {
			throw new UnauthorizedException("You don't have permission to view this organisation")
		}
		return this.organisationRepository.getProjects({ organisationId })
	}
}
