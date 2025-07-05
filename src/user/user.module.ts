import { Module } from '@nestjs/common';
import { ReadMyUserDetailService } from './application/service/read-my-user-detail.service';
import { UserEntity } from '../core/infra/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { UpdateUserService } from './application/service/update-user.service';
import { UserRepository } from './repository/user.repository';
import { UnivRepository } from './repository/univ.repository';
import { ReadUserDetailService } from './application/service/read-user-detail.service';
import { LinkRepository } from './repository/link.repository';
import { CreateUnivService } from './application/service/create-univ-service';
import { ReadUnivBriefService } from './application/service/read-univ-brief.service';
import { ReadUnivDetailService } from './application/service/read-univ-detail.service';
import { UpdateUnivService } from './application/service/update-univ.service';
import { DeleteUnivService } from './application/service/delete-univ.service';
import { ReadUserBriefService } from './application/service/read-user-brief.service';
import { ReadUserOverviewService } from './application/service/read-user-overview.service';
import { ReadAdminUserDetailService } from './application/service/read-admin-user-detail.service';
import { MemberRepository } from '../team/repository/member.repository';
import { UpdateAdminUserService } from './application/service/update-admin-user-service';
import { DeleteUserService } from './application/service/delete-user.service';
import { UserQueryV1Controller } from './controller/query/user-query-v1.controller';
import { UserCommandV1Controller } from './controller/command/user-command-v1.controller';
import { AdminUserCommandV1Controller } from './controller/command/admin-user-command-v1.controller';
import { AdminUserQueryV1Controller } from './controller/query/admin-user-query-v1.controller';
import { CreateUserService } from './application/service/create-user.service';
import { CreateUserByExcelService } from './application/service/create-user-by-excel.service';
import { UpdateAdminUserPasswordService } from './application/service/update-admin-user-password-service';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    CreateUserService,
    CreateUserByExcelService,
    ReadMyUserDetailService,
    ReadUserDetailService,
    UpdateUserService,
    UpdateAdminUserService,
    DeleteUserService,
    CreateUnivService,
    ReadUnivBriefService,
    ReadUnivDetailService,
    UpdateUnivService,
    DeleteUnivService,
    ReadUserBriefService,
    ReadUserOverviewService,
    ReadAdminUserDetailService,
    UpdateAdminUserPasswordService,
    UnivRepository,
    UserRepository,
    MemberRepository,
    LinkRepository,
  ],
  controllers: [UserQueryV1Controller, UserCommandV1Controller, AdminUserCommandV1Controller, AdminUserQueryV1Controller],
  exports: [UserRepository, UnivRepository],
})
export class UserModule {}
