import { User } from '@prisma/client'
import { Exclude } from 'class-transformer'

export class UserEntity implements User {
	id: number
	email: string
	name: string
	verified: boolean

	@Exclude()
	passwordHash: string

	createdAt: Date
	updatedAt: Date

	constructor(user: UserEntity) {
		Object.assign(this, user)
	}
}
