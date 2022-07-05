import { Module } from '@nestjs/common'
import { PrismaService } from 'src/data/repositories/prisma.service'
import { ProjectRepository } from 'src/data/repositories/project.repository'
import { AuthModule } from '../auth/auth.module'
import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'

@Module({
	controllers: [ProjectController],
	providers: [ProjectService, ProjectRepository, PrismaService],
	imports: [AuthModule],
})
export class ProjectModule {}
