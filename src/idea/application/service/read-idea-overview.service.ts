import { ReadIdeaOverviewUsecase } from '../usecase/read-idea-overview.usecase';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';
import { IdeaEntity } from '../../../core/infra/entities/idea.entity';
import { IdeaRepositoryImpl } from '../../repository/idea.repository.impl';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaOverviewService implements ReadIdeaOverviewUsecase {
  constructor(
    private readonly ideaRepository: IdeaRepositoryImpl,
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

      const response: ReadIdeaOverviewResponseDto = {
        success: true,
        data: {
          ideas,
          page_info: {
            current_page: page,
            page_size: size,
            total_pages: totalPages,
            total_items: totalItems,
          },
        },
        error: null,
      };

      return response;
    });
  }
}