import { Module } from '@nestjs/common';
import { IdeasController } from './ideas.controller';
import { IdeasService } from './ideas.service';
import { Idea } from '../database/entities/idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaRepository } from '../database/repositories/idea.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Idea, IdeaRepository])],
  controllers: [IdeasController],
  providers: [IdeasService],
})
export class IdeasModule {}
