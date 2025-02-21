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
    UnivRepository,
    UserRepository
  ],
  controllers: [UserQueryV1Controller, UserCommandV1Controller],
  exports: [UserRepository, UnivRepository],
})
export class UserModule {}
