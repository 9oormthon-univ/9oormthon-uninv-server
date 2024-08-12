import { Module } from '@nestjs/common';
import { UsersIdeasApplysController } from './users-ideas-applys.controller';
import { UsersIdeasApplysService } from './users-ideas-applys.service';
import { UsersIdeasApply } from '../database/entities/users-ideas-apply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UsersIdeasApplyRepository } from '../database/repositories/user-ideas-apply.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UsersIdeasApply, UsersIdeasApplyRepository]),
  ],
  controllers: [UsersIdeasApplysController],
  providers: [UsersIdeasApplysService],
})
export class UsersIdeasApplysModule {}
