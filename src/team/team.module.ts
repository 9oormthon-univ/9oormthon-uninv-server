import { Module } from '@nestjs/common';
import { TeamEntity } from '../core/infra/entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { TeamRepository } from './repository/team.repository';
import { MemberEntity } from '../core/infra/entities/member.entity';
import { MemberRepository } from './repository/member.repository';
import { ProjectEntity } from '../core/infra/entities/project.entity';
import { UserTeamQueryV1Controller } from './controller/query/user-team-query-v1.controller';
import { TeamCommandV1Controller } from './controller/command/team-command-v1.controller';
import { ReadTeamDetailService } from './application/service/read-team-detail.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        TeamEntity,
        MemberEntity,
        ProjectEntity,
      ]
    )
  ],
  controllers: [UserTeamQueryV1Controller, TeamCommandV1Controller],
  providers: [
    TeamRepository,
    MemberRepository,
    ReadTeamDetailService
  ],
  exports: [TeamRepository, MemberRepository]
})
export class TeamModule {}
