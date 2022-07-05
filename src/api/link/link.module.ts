import { Module } from '@nestjs/common'
import { LinkRepository } from 'src/data/repositories/link.repository'
import { PrismaService } from 'src/data/repositories/prisma.service'
import { UserRepository } from 'src/data/repositories/user.repository'
import { HelperService } from 'src/utils/helper.service'
import { AuthModule } from '../auth/auth.module'
import { LinkController } from './link.controller'
import { LinkService } from './link.service'

@Module({
	controllers: [LinkController],
	providers: [LinkService, LinkRepository, UserRepository, PrismaService, HelperService],
	imports: [AuthModule],
})
export class LinkModule {}
