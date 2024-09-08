import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from '../database/entities/project.entity';
import { DatabaseModule } from '../database/database.module';
import { ProjectRepository } from '../database/repositories/project.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Project, ProjectRepository]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
