import { Injectable } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { JwtService } from '@nestjs/jwt'
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
}
