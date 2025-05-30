import { Module } from '@nestjs/common';
import { ReadMyUserDetailService } from './application/service/read-my-user-detail.service';
import { UserEntity } from '../core/infra/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { UpdateUserService } from './application/service/update-user.service';
import { UserQueryV1Controller } from './controller/query/user.query.v1.controller';
import { UserCommandV1Controller } from './controller/command/user.command.v1.controller';
import { UserRepository } from './repository/user.repository';
import { UnivRepository } from './repository/univ.repository';
import { ReadUserDetailService } from './application/service/read-user-detail.service';
import { LinkRepository } from './repository/link.repository';
import { CreateUnivService } from './application/service/create-univ-service';
import { ReadUnivBriefService } from './application/service/read-univ-brief.service';
import { ReadUnivDetailService } from './application/service/read-univ-detail.service';
import { UpdateUnivService } from './application/service/update-univ.service';
import { DeleteUnivService } from './application/service/delete-univ.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    ReadMyUserDetailService,
    ReadUserDetailService,
    UpdateUserService,
    CreateUnivService,
    ReadUnivBriefService,
    ReadUnivDetailService,
    UpdateUnivService,
    DeleteUnivService,
    UnivRepository,
    UserRepository,
    LinkRepository,
  ],
  controllers: [UserQueryV1Controller, UserCommandV1Controller],
  exports: [UserRepository, UnivRepository],
})
export class UserModule {}
