import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { ReadIdeaSubjectBriefResponseDto } from '../dto/response/read-idea-subject-brief.response.dto';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaSubjectBriefService {
  constructor(
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(generation: number): Promise<ReadIdeaSubjectBriefResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 아이디어 주제 조회 기간 유효성 검증
      systemSetting.validateIdeaSubjectViewPeriod();

      // 아이디어 주제 조회
      const ideaSubjects = await this.ideaSubjectRepository.findAllByGenerationAndIsActiveTrue(generation, manager);

      return ReadIdeaSubjectBriefResponseDto.from(ideaSubjects);
    });
  }
}