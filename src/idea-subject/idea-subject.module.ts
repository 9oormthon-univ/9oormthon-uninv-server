import { Module } from '@nestjs/common';
import { IdeaSubjectController } from './idea-subject.controller';
import { IdeaSubjectService } from './idea-subject.service';
import { IdeaSubject } from '../database/entities/idea-subject.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { IdeaSubjectRepository } from '../database/repositories/idea-subject.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([IdeaSubject, IdeaSubjectRepository]),
  ],
  controllers: [IdeaSubjectController],
  providers: [IdeaSubjectService],
})
export class IdeaModule {}
