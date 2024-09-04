import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../database/repositories/user.repository';
import { UsersSemestersRepository } from '../database/repositories/users-semesters.repository';
import { UnivRepository } from '../database/repositories/univ.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([User])],
  providers: [
    UsersService,
    UserRepository,
    UsersSemestersRepository,
    UnivRepository,
  ],
  controllers: [UsersController],
  exports: [UserRepository],
})
export class UsersModule {}
