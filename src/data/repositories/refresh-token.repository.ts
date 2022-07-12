import { Injectable } from '@nestjs/common'
import { Prisma, RefreshToken } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class RefreshTokenRepository {
	constructor(private readonly prisma: PrismaService) {}

	refreshToken(
		refreshTokenWhereUniqueInput: Prisma.RefreshTokenWhereUniqueInput,
	): Promise<RefreshToken> {
		return this.prisma.refreshToken.findUnique({ where: refreshTokenWhereUniqueInput })
	}

	getUserRefreshTokens({ userId }: { userId: number }): Promise<RefreshToken[]> {
		return this.prisma.refreshToken.findMany({
			where: { userId },
			orderBy: {
				createdAt: 'desc',
			},
		})
	}

	createRefreshToken(
		refreshTokenCreateInput: Prisma.RefreshTokenCreateInput,
	): Promise<RefreshToken> {
		return this.prisma.refreshToken.create({ data: refreshTokenCreateInput })
	}

	deleteRefreshToken(
		refreshTokenWhereUniqueInput: Prisma.RefreshTokenWhereUniqueInput,
	): Promise<RefreshToken> {
		return this.prisma.refreshToken.delete({ where: refreshTokenWhereUniqueInput })
	}

	deleteRefreshTokens(refreshTokenWhereInput: Prisma.RefreshTokenWhereInput) {
		return this.prisma.refreshToken.deleteMany({ where: refreshTokenWhereInput })
	}
}
