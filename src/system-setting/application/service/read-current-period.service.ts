import { DataSource } from 'typeorm';
import { SystemSettingRepository } from '../../repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadCurrentPeriodResponseDto } from '../dto/response/read-current-period.response.dto';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadCurrentPeriodService {
  constructor(
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute() {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 현재 기간 반환
      return ReadCurrentPeriodResponseDto.of(
        systemSetting.getWhichPeriod()
      );
    });
  }
}