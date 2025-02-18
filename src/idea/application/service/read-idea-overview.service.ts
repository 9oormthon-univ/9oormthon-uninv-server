import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';
import { IdeaRepository } from '../../repository/idea.repository';
import { PageInfoDto } from '../../../core/dto/page-info.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaOverviewService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    userId: number,
  ): Promise<ReadIdeaOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 아이디어 조회
      const { ideas, totalItems } = await this.ideaRepository.findIdeaOverview(
        page,
        size,
        generation,
        subjectId,
        isActive,
        isBookmarked,
        userId,
        manager
      );

      const totalPages = Math.ceil(totalItems / size);

      const pageInfoDto = PageInfoDto.of(page, size, totalPages, totalItems);

      return ReadIdeaOverviewResponseDto.of(ideas,pageInfoDto);
    });
  }
}