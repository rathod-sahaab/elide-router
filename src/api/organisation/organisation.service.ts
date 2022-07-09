import { Injectable } from '@nestjs/common'
import { OrganisationRepository } from 'src/data/repositories/organisation.repository'

@Injectable()
export class OrganisationService {
	constructor(private readonly organisationRepository: OrganisationRepository) {}

	getUserOrganisations({ userId }: { userId: number }) {
		this.organisationRepository.getUserOrganisations({ userId })
	}
}
