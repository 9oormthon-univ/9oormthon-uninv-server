import { Module } from '@nestjs/common';
import { UserIdeaCommandV1Controller } from '../controller/command/user-idea-command-v1.controller';
import { CreateIdeaService } from '../service/create-idea.service';
import { IdeaEntity } from '../../../core/infra/entities/idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaRepository } from '../../repository/idea.repository';
import { DatabaseModule } from '../../../core/infra/database.module';
import { IdeaRepositoryImpl } from '../../repository/idea.repository.impl';
import { UserIdeaQueryV1Controller } from '../controller/query/user-idea-query-v1.controller';
import { UserModule } from '../../../user/application/module/user.module';
import { IdeaSubjectRepositoryImpl } from '../../repository/idea-subject.repository.impl';
import { CreateIdeaSubjectService } from '../service/create-idea-subject.service';
import { ApplyRepositoryImpl } from '../../repository/apply.repository.impl';
import { BookmarkRepositoryImpl } from '../../repository/bookmark.repository.impl';
import { AdminIdeaCommandV1Controller } from '../controller/command/admin-idea-command-v1.controller';
import { AdminIdeaQueryV1Controller } from '../controller/query/admin-idea-query-v1.controller';
import { UpdateIdeaSubjectIsActiveService } from '../service/update-idea-subject-is-active.service';
import { CreateApplyService } from '../service/create-apply.service';
import { CreateOrDeleteBookmarkService } from '../service/create-or-delete-bookmark.service';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [IdeaEntity]
    ),
    UserModule
  ],
  controllers: [
    UserIdeaCommandV1Controller,
    UserIdeaQueryV1Controller,
    AdminIdeaCommandV1Controller,
    AdminIdeaQueryV1Controller
  ],
  providers: [
    CreateIdeaService,
    CreateIdeaSubjectService,
    UpdateIdeaSubjectIsActiveService,
    CreateApplyService,
    CreateOrDeleteBookmarkService,
    IdeaRepositoryImpl,
    IdeaSubjectRepositoryImpl,
    ApplyRepositoryImpl,
    BookmarkRepositoryImpl
  ],
})
export class IdeaModule {}
