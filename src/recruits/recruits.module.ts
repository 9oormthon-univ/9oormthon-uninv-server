import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruit } from '../database/entities/recruit.entity';
import { RecruitsService } from './recruits.service';
import { RecruitRepository } from '../database/repositories/recruit.repository';
import { RecruitsController } from './recruits.controller';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Recruit])],
  providers: [RecruitsService, RecruitRepository],
  controllers: [RecruitsController],
})
export class RecruitsModule {}
