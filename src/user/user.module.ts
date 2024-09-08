import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/entities/user.entity';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../database/repositories/user.repository';
import { UserSemesterRepository } from '../database/repositories/user-semester.repository';
import { UnivRepository } from '../database/repositories/univ.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserRepository,
    UserSemesterRepository,
    UnivRepository,
  ],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
