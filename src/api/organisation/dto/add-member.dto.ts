import { OrganisationMemberRole } from '@prisma/client'
import { IsEmail, IsEnum, IsInt } from 'class-validator'

export class AddMemberParams {
	@IsInt()
	orgId: number
}

export class AddMemberBody {
	@IsEmail()
	memberEmail: string

	@IsEnum(OrganisationMemberRole)
	role: OrganisationMemberRole
}
