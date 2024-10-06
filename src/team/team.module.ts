import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { Team } from '../database/entities/team.entity';
import { TeamService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { TeamRepository } from '../database/repositories/team.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Team, TeamRepository])],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
