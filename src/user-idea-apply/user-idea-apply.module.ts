import { Module } from '@nestjs/common';
import { UserIdeaApplyController } from './user-idea-apply.controller';
import { UserIdeaApplyService } from './user-idea-apply.service';
import { UserIdeaApply } from '../database/entities/user-idea-apply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserIdeaApplyRepository } from '../database/repositories/user-idea-apply.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserIdeaApply, UserIdeaApplyRepository]),
  ],
  controllers: [UserIdeaApplyController],
  providers: [UserIdeaApplyService],
})
export class UserIdeaApplyModule {}
