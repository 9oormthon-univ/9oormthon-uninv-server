import { Module } from '@nestjs/common';
import { UnivController } from './univ.controller';
import { UnivService } from './univ.service';
import { DatabaseModule } from '../database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Univ } from '../database/entities/univ.entity';
import { UnivRepository } from '../database/repositories/univ.repository';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    DatabaseModule,
    TypeOrmModule.forFeature([Univ]),
  ],
  providers: [UnivService, UnivRepository],
  controllers: [UnivController],
  exports: [UnivRepository],
})
export class UnivModule {}
