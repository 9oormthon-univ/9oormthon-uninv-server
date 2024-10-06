import { Module } from '@nestjs/common';
import { UserTeamController } from './user-team.controller';
import { UserTeam } from '../database/entities/user-team.entity';
import { UserTeamService } from './user-team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UserTeamRepository } from '../database/repositories/user-team.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserTeam, UserTeamRepository]),
  ],
  controllers: [UserTeamController],
  providers: [UserTeamService],
})
export class UserTeamModule {}
