import { forwardRef, Module } from '@nestjs/common';
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
import { ReadTeamOverviewService } from './application/service/read-team-overview.service';
import { UserModule } from '../user/user.module';
import { AdminTeamQueryV1Controller } from './controller/query/admin-team-query-v1.controller';
import { AdminTeamCommandV1Controller } from './controller/command/admin-team-command-v1.controller';
import { CreateTeamService } from './application/service/create-team.service';
import { CreateMemberService } from './application/service/create-member.service';
import { ReadMemberOverviewService } from './application/service/read-member-overview.service';
import { ReadAdminTeamDetailService } from './application/service/read-admin-team-detail.service';
import { UpdateMemberIsLeaderService } from './application/service/update-member-is-leader.service';
import { ProjectRepository } from './repository/project.repository';
import { DeleteMemberService } from './application/service/delete-member.service';
import { IdeaModule } from '../idea/idea.module';
import { SystemSettingModule } from '../system-setting/system-setting.module';
import { DeleteTeamService } from './application/service/delete-team.service';
import { UpdateTeamStatusService } from './application/service/update-team-status.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        TeamEntity,
        MemberEntity,
        ProjectEntity,
      ]
    ),
    UserModule,
    SystemSettingModule,
    forwardRef(() => IdeaModule),
  ],
  controllers: [UserTeamQueryV1Controller, UserTeamCommandV1Controller, AdminTeamQueryV1Controller, AdminTeamCommandV1Controller],
  providers: [
    TeamRepository,
    MemberRepository,
    ProjectRepository,
    CreateTeamService,
    CreateMemberService,
    ReadTeamDetailService,
    ReadTeamOverviewService,
    ReadMemberOverviewService,
    ReadAdminTeamDetailService,
    UpdateMemberIsLeaderService,
    UpdateTeamService,
    DeleteTeamService,
    DeleteMemberService,
    UpdateTeamStatusService
  ],
  exports: [TeamRepository, MemberRepository, ProjectRepository]
})
export class TeamModule {}
