import { Module } from '@nestjs/common';
import { ReadUserDetailService } from '../service/read-user-detail.service';
import { UserEntity } from '../../../core/infra/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../../core/infra/database.module';
import { MulterModule } from '@nestjs/platform-express';
import { UpdateUserService } from '../service/update-user.service';
import { UserQueryV1Controller } from '../controller/query/user.query.v1.controller';
import { UserCommandV1Controller } from '../controller/command/user.command.v1.controller';
import { UserRepositoryImpl } from '../../repository/user.repository.impl';
import { UnivRepositoryImpl } from '../../repository/univ.repository.impl';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    ReadUserDetailService,
    UpdateUserService,
    UnivRepositoryImpl,
    UserRepositoryImpl
  ],
  controllers: [UserQueryV1Controller, UserCommandV1Controller],
  exports: [UserRepositoryImpl, UnivRepositoryImpl],
})
export class UserModule {}
