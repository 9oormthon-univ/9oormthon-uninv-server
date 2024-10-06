import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recruit } from '../database/entities/recruit.entity';
import { RecruitService } from './recruit.service';
import { RecruitRepository } from '../database/repositories/recruit.repository';
import { RecruitController } from './recruit.controller';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Recruit])],
  providers: [RecruitService, RecruitRepository],
  controllers: [RecruitController],
})
export class RecruitModule {}
