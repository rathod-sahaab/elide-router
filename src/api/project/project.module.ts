import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
	controllers: [ProjectController],
	providers: [ProjectService],
	imports: [AuthModule],
})
export class ProjectModule {}
