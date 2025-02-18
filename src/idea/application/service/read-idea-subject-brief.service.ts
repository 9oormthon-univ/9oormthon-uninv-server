import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { ReadIdeaSubjectBriefResponseDto } from '../dto/response/read-idea-subject-brief.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaSubjectBriefService {
  constructor(
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(): Promise<ReadIdeaSubjectBriefResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 아이디어 주제 조회
      const ideaSubjects = await this.ideaSubjectRepository.findAll(manager);

      return ReadIdeaSubjectBriefResponseDto.from(ideaSubjects);
    });
  }
}