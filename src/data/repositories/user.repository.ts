import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { User, Prisma, OrganisationMemberRole } from '@prisma/client'

@Injectable()
export class UserRepository {
	constructor(private prisma: PrismaService) {}

	async user(userWhereUniqueInput: Prisma.UserWhereUniqueInput): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: userWhereUniqueInput,
		})
	}

	async users(params: {
		skip?: number
		take?: number
		cursor?: Prisma.UserWhereUniqueInput
		where?: Prisma.UserWhereInput
		orderBy?: Prisma.UserOrderByWithRelationInput
	}): Promise<User[]> {
		const { skip, take, cursor, where, orderBy } = params
		return this.prisma.user.findMany({
			skip,
			take,
			cursor,
			where,
			orderBy,
		})
	}

	async makeUserVerified({ userId }: { userId: number }) {
		return this.prisma.user.update({
			where: { id: userId },
			data: { verified: true },
		})
	}

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		})
	}

	async updateUser(
		where: Prisma.UserWhereUniqueInput,
		data: Prisma.UserUpdateInput,
	): Promise<User> {
		return this.prisma.user.update({
			data,
			where,
		})
	}

	async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
		return this.prisma.user.delete({
			where,
		})
	}

	async userCanViewInOrganisation({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}): Promise<boolean> {
		const orgRelation = await this.prisma.usersOnOrganisations.findUnique({
			where: {
				userId_organisationId: {
					userId,
					organisationId,
				},
			},
		})

		if (!orgRelation) {
			return false
		}

		return true
	}

	async canAddMembers({ userId, organisationId }: { userId: number; organisationId: number }) {
		const orgRelation = await this.prisma.usersOnOrganisations.findUnique({
			where: {
				userId_organisationId: {
					userId,
					organisationId,
				},
			},
		})

		if (!orgRelation) {
			return false
		}

		return orgRelation.role === OrganisationMemberRole.ADMIN
	}

	canDeleteMembers({ userId, organisationId }: { userId: number; organisationId: number }) {
		// TODO: implement delete permission separately
		return this.canAddMembers({ userId, organisationId })
	}
}
