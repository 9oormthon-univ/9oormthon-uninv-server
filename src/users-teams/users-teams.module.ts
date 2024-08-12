import { Module } from '@nestjs/common';
import { UsersTeamsController } from './users-teams.controller';
import { UsersTeam } from '../database/entities/users-team.entity';
import { UsersTeamsService } from './users-teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { UsersTeamRepository } from '../database/repositories/users-team.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UsersTeam, UsersTeamRepository]),
  ],
  controllers: [UsersTeamsController],
  providers: [UsersTeamsService],
})
export class UsersTeamsModule {}
