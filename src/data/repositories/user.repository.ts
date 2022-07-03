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

	async createUser(data: Prisma.UserCreateInput): Promise<User> {
		return this.prisma.user.create({
			data,
		})
	}

	async updateUser(params: {
		where: Prisma.UserWhereUniqueInput
		data: Prisma.UserUpdateInput
	}): Promise<User> {
		const { where, data } = params
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

	async userCanCreateLinkInProject({
		userId,
		projectId,
	}: {
		userId: number
		projectId: number
	}): Promise<boolean> {
		const project = await this.prisma.project.findUnique({
			where: {
				id: projectId,
			},
		})

		if (!project) {
			throw new NotFoundException(`Project with id ${projectId} not found`)
		}

		if (project.ownerId === userId) {
			return true
		}

		if (!project.organisationId) {
			return false
		}

		// project is part of an organisation where the user is a maker or an admin
		const orgRelation = await this.prisma.usersOnOrganisations.findUnique({
			where: {
				userId_organisationId: {
					userId: userId,
					organisationId: project.organisationId,
				},
			},
		})

		if (!orgRelation) {
			return false
		}

		// can add more roles so explicit inclusion is better than implicit inclusion
		if (
			orgRelation.role === OrganisationMemberRole.MAKER ||
			orgRelation.role === OrganisationMemberRole.ADMIN
		) {
			return true
		}

		return false
	}

	async userCanCreateLinkInOrganisation({
		userId,
		organisationId,
	}: {
		userId: number
		organisationId: number
	}): Promise<boolean> {
		const orgRelation = await this.prisma.usersOnOrganisations.findUnique({
			where: {
				userId_organisationId: {
					userId: userId,
					organisationId: organisationId,
				},
			},
		})

		if (!orgRelation) {
			return false
		}

		return (
			orgRelation.role == OrganisationMemberRole.MAKER ||
			orgRelation.role === OrganisationMemberRole.ADMIN
		)
	}
}
