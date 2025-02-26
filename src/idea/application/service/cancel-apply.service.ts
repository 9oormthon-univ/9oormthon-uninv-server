import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { EApplyStatus } from '../../../core/enums/apply-status.enum';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CancelApplyService {
  constructor(
    private readonly applyRepository: ApplyRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: number, applyId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 지원 정보 조회
      const apply = await this.applyRepository.findById(applyId, manager);
      if (!apply) {
        throw new CommonException(ErrorCode.NOT_FOUND_APPLY);
      }

      // 시스템 설정의 지원 취소 기간 확인
      systemSetting.validateDeleteApplyPeriod(apply.phase);

      // 지원 정보의 유저와 요청한 유저가 일치하는지 확인
      if (apply.user.id !== userId) {
        throw new CommonException(ErrorCode.NOT_MATCH_USER_ERROR);
      }

      // 지원 정보의 상태가 WAITING 인지 확인
      if (apply.status !== EApplyStatus.WAITING) {
        throw new CommonException(ErrorCode.APPLY_STATUS_ERROR);
      }

      await this.applyRepository.delete(apply.id, manager);
    });
  }
}