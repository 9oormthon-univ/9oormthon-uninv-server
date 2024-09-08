import { Module } from '@nestjs/common';
import { ProjectMemberService } from './project-member.service';
import { ProjectMemberController } from './project-member.controller';
import { ProjectMember } from '../database/entities/project-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { ProjectMemberRepository } from '../database/repositories/project-member.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([ProjectMember, ProjectMemberRepository]),
  ],
  providers: [ProjectMemberService],
  controllers: [ProjectMemberController],
})
export class ProjectMemberModule {}
