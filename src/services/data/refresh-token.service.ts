import { Injectable } from '@nestjs/common'
// import { ConfigService } from '@nestjs/config'
// import { JwtService } from '@nestjs/jwt'
import { Prisma, RefreshToken } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class RefreshTokenService {
	constructor(
		// private readonly configService: ConfigService,
		// private readonly jwtService: JwtService,
		private readonly prisma: PrismaService,
	) {}

	refreshToken(
		refreshTokenWhereUniqueInput: Prisma.RefreshTokenWhereUniqueInput,
	): Promise<RefreshToken> {
		return this.prisma.refreshToken.findUnique({ where: refreshTokenWhereUniqueInput })
	}

	async createRefreshToken(
		refreshTokenCreateInput: Prisma.RefreshTokenCreateInput,
	): Promise<RefreshToken> {
		return this.prisma.refreshToken.create({ data: refreshTokenCreateInput })
	}
}
