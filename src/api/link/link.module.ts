import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { LinkController } from './link.controller'
import { LinkService } from './link.service'

@Module({
	controllers: [LinkController],
	providers: [LinkService],
	imports: [AuthModule],
	exports: [LinkService],
})
export class LinkModule {}
