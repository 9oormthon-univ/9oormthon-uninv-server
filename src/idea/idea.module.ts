import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { Idea } from '../database/entities/idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaRepository } from '../database/repositories/idea.repository';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Idea, IdeaRepository])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
