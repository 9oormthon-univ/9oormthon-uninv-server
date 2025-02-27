import { Module } from '@nestjs/common';
import { TeamEntity } from '../core/infra/entities/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { TeamRepository } from './repository/team.repository';
import { MemberEntity } from '../core/infra/entities/member.entity';
import { MemberRepository } from './repository/member.repository';
import { ProjectEntity } from '../core/infra/entities/project.entity';
import { UserTeamQueryV1Controller } from './controller/query/user-team-query-v1.controller';
import { UserTeamCommandV1Controller } from './controller/command/user-team-command-v1.controller';
import { ReadTeamDetailService } from './application/service/read-team-detail.service';
import { UpdateTeamService } from './application/service/update-team.service';

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
  controllers: [UserTeamQueryV1Controller, UserTeamCommandV1Controller],
  providers: [
    TeamRepository,
    MemberRepository,
    ReadTeamDetailService,
    UpdateTeamService
  ],
  exports: [TeamRepository, MemberRepository]
})
export class TeamModule {}
