import { Module } from '@nestjs/common';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { Apply } from '../database/entities/apply.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { ApplyRepository } from '../database/repositories/apply.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Apply, ApplyRepository])],
  controllers: [ApplyController],
  providers: [ApplyService],
})
export class ApplyModule {}
