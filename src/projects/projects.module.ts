import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { Project } from '../database/entities/project.entity';
import { DatabaseModule } from '../database/database.module';
import { ProjectRepository } from '../database/repositories/project.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Project, ProjectRepository]),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService],
})
export class ProjectsModule {}
