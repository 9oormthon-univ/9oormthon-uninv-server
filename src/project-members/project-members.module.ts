import { Module } from '@nestjs/common';
import { ProjectMembersService } from './project-members.service';
import { ProjectMembersController } from './project-members.controller';
import { ProjectMember } from '../database/entities/project-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { ProjectMemberRepository } from '../database/repositories/project-member.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ProjectMember, ProjectMemberRepository]),
  ],
  providers: [ProjectMembersService],
  controllers: [ProjectMembersController],
})
export class ProjectMembersModule {}
