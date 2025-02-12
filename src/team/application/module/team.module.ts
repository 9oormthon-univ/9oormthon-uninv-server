import { Module } from '@nestjs/common';
import { TeamEntity } from '../../../core/database/entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../../core/database/database.module';
import { TeamRepository } from '../../repository/team.repository';
import { MemberEntity } from '../../../core/database/entities/member.entity';
import { MemberRepository } from '../../repository/member.repository';
import { ProjectEntity } from '../../../core/database/entities/project.entity';
import { ProjectRepository } from '../../repository/project.repository';
import { TeamQueryV1Controller } from '../controller/query/team-query-v1.controller';
import { TeamCommandV1Controller } from '../controller/command/team-command-v1.controller';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        TeamEntity,
        TeamRepository,
        MemberEntity,
        MemberRepository,
        ProjectEntity,
        ProjectRepository
      ]
    )
  ],
  controllers: [TeamQueryV1Controller, TeamCommandV1Controller],
  providers: [

  ],
})
export class TeamModule {}
