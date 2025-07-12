import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';
import { IdeaRepository } from '../../repository/idea.repository';
import { PageInfoDto } from '../../../core/dto/page-info.dto';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { EPeriod } from '../../../core/enums/period.enum';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaOverviewService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    search: string | undefined,
    userId: number,
  ): Promise<ReadIdeaOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      if (systemSetting.getWhichPeriod() === EPeriod.NONE) {
        return ReadIdeaOverviewResponseDto.of([], PageInfoDto.of(1, 1, 1, 0), systemSetting.maxIdeaNumber, 0);
      }

      // 아이디어 조회
      const { ideas, totalItems } = await this.ideaRepository.findIdeaOverview(
        page,
        size,
        generation,
        subjectId,
        isActive,
        isBookmarked,
        search,
        userId,
        manager
      );

      const totalPages = Math.ceil(totalItems / size);

      const pageInfoDto = PageInfoDto.of(page, size, totalPages, totalItems);

      const allIdeasCount = await this.ideaRepository.countAllIdeasByGeneration(generation, manager);

      if (systemSetting.getWhichPeriod() === EPeriod.IDEA_SUBMISSION) {
        return ReadIdeaOverviewResponseDto.of([], PageInfoDto.of(1, 1, 1, 0), systemSetting.maxIdeaNumber, allIdeasCount);
      }

      return ReadIdeaOverviewResponseDto.of(ideas,pageInfoDto, systemSetting.maxIdeaNumber, allIdeasCount);
    });
  }
}