import { forwardRef, Module } from '@nestjs/common';
import { UserIdeaCommandV1Controller } from './controller/command/user-idea-command-v1.controller';
import { CreateIdeaService } from './application/service/create-idea.service';
import { IdeaEntity } from '../core/infra/entities/idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaRepository } from './repository/idea.repository';
import { DatabaseModule } from '../core/infra/database.module';
import { UserIdeaQueryV1Controller } from './controller/query/user-idea-query-v1.controller';
import { UserModule } from '../user/user.module';
import { IdeaSubjectRepository } from './repository/idea-subject.repository';
import { CreateIdeaSubjectService } from './application/service/create-idea-subject.service';
import { ApplyRepository } from './repository/apply.repository';
import { BookmarkRepository } from './repository/bookmark.repository';
import { AdminIdeaCommandV1Controller } from './controller/command/admin-idea-command-v1.controller';
import { UpdateIdeaSubjectIsActiveService } from './application/service/update-idea-subject-is-active.service';
import { CreateApplyService } from './application/service/create-apply.service';
import { CreateOrDeleteBookmarkService } from './application/service/create-or-delete-bookmark.service';
import { ReadIdeaOverviewService } from './application/service/read-idea-overview.service';
import { TeamModule } from '../team/team.module';
import { ReadMyIdeaDetailService } from './application/service/read-my-idea-detail.service';
import { ReadIdeaDetailService } from './application/service/read-idea-detail.service';
import { ReadIdeaSubjectBriefService } from './application/service/read-idea-subject-brief.service';
import { AdminIdeaQueryV1Controller } from './controller/query/admin-idea-query-v1.controller';
import { SystemSettingModule } from '../system-setting/system-setting.module';
import { ReadRemainPreferenceBriefService } from './application/service/read-remain-preference-brief.service';
import { UpdateIdeaService } from './application/service/update-idea.service';
import { ReadMyApplyOverviewService } from './application/service/read-my-apply-overview.service';
import { ReadTeamApplyOverviewService } from './application/service/read-team-apply-overview.service';
import { AcceptApplyService } from './application/service/accept-apply.service';
import { RejectApplyService } from './application/service/reject-apply.service';
import { CancelApplyService } from './application/service/cancel-apply.service';
import { ScheduleModule } from '@nestjs/schedule';
import {
  HandlePeriodTransitionBySchedulerService,
} from './application/service/handle-period-transition-by-scheduler.service';
import { DeleteIdeaService } from './application/service/delete-idea.service';
import { BookmarkEntity } from '../core/infra/entities/bookmark.entity';
import { ApplyEntity } from '../core/infra/entities/apply.entity';
import { IdeaSubjectEntity } from '../core/infra/entities/idea-subject.entity';
import { ReadAdminIdeaSubjectBriefService } from './application/service/read-admin-idea-subject-brief.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature(
      [
        ApplyEntity,
        BookmarkEntity,
        IdeaEntity,
        IdeaSubjectEntity
      ]
    ),
    UserModule,
    forwardRef(() =>TeamModule),
    SystemSettingModule
  ],
  controllers: [
    UserIdeaCommandV1Controller,
    UserIdeaQueryV1Controller,
    AdminIdeaCommandV1Controller,
    AdminIdeaQueryV1Controller
  ],
  providers: [
    HandlePeriodTransitionBySchedulerService,
    CreateIdeaService,
    CreateIdeaSubjectService,
    UpdateIdeaSubjectIsActiveService,
    CreateApplyService,
    CreateOrDeleteBookmarkService,
    ReadIdeaOverviewService,
    ReadMyIdeaDetailService,
    ReadIdeaDetailService,
    ReadIdeaSubjectBriefService,
    ReadRemainPreferenceBriefService,
    ReadMyApplyOverviewService,
    UpdateIdeaService,
    ReadTeamApplyOverviewService,
    AcceptApplyService,
    RejectApplyService,
    CancelApplyService,
    DeleteIdeaService,
    ReadAdminIdeaSubjectBriefService,
    IdeaRepository,
    IdeaSubjectRepository,
    ApplyRepository,
    BookmarkRepository,
  ],
  exports: [
    IdeaRepository,
    ApplyRepository
  ]
})
export class IdeaModule {}
