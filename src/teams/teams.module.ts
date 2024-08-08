import { Module } from '@nestjs/common';
import { TeamsController } from './teams.controller';
import { Team } from '../database/entities/team.entity';
import { TeamsService } from './teams.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { TeamRepository } from '../database/repositories/team.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Team, TeamRepository])],
  controllers: [TeamsController],
  providers: [TeamsService],
})
export class TeamsModule {}
