import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../database/entities/user.entity';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserRepository } from '../database/repositories/user.repository';
import { UnivRepository } from '../database/repositories/univ.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UserService, UserRepository, UnivRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
