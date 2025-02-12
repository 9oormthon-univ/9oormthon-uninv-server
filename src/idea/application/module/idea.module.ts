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
    UserIdeaQueryV1Controller
  ],
  providers: [
    CreateIdeaService,
    IdeaRepositoryImpl,
    IdeaSubjectRepositoryImpl
  ],
})
export class IdeaModule {}
