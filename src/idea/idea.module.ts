import { Module } from '@nestjs/common';
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
import { AdminIdeaQueryV1Controller } from './controller/query/admin-idea-query-v1.controller';
import { UpdateIdeaSubjectIsActiveService } from './application/service/update-idea-subject-is-active.service';
import { CreateApplyService } from './application/service/create-apply.service';
import { CreateOrDeleteBookmarkService } from './application/service/create-or-delete-bookmark.service';
import { ReadIdeaOverviewService } from './application/service/read-idea-overview.service';
import { TeamModule } from '../team/team.module';
import { ReadMyIdeaDetailService } from './application/service/read-my-idea-detail.service';
import { ReadIdeaDetailService } from './application/service/read-idea-detail.service';
import { ReadIdeaSubjectBriefService } from './application/service/read-idea-subject-brief.service';
import { IdeaQueryV1Controller } from './controller/query/idea-query-v1.controller';
import { SystemSettingModule } from '../system-setting/system-setting.module';
import { ReadRemainPreferenceBriefService } from './application/service/read-remain-preference-brief.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [IdeaEntity]
    ),
    UserModule,
    TeamModule,
    SystemSettingModule
  ],
  controllers: [
    UserIdeaCommandV1Controller,
    UserIdeaQueryV1Controller,
    AdminIdeaCommandV1Controller,
    AdminIdeaQueryV1Controller,
    IdeaQueryV1Controller
  ],
  providers: [
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
    IdeaRepository,
    IdeaSubjectRepository,
    ApplyRepository,
    BookmarkRepository
  ],
})
export class IdeaModule {}
