import { Module } from '@nestjs/common';
import { UserIdeaCommandV1Controller } from '../controller/command/user-idea-command-v1.controller';
import { IdeaService } from '../service/idea.service';
import { IdeaEntity } from '../../../core/infra/entities/idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaRepository } from '../../repository/idea.repository';
import { DatabaseModule } from '../../../core/infra/database.module';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([IdeaEntity, IdeaRepository])],
  controllers: [UserIdeaCommandV1Controller],
  providers: [IdeaService],
})
export class IdeaModule {}
