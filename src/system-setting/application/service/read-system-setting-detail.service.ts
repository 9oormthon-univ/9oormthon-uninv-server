import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { SystemSettingRepository } from '../../repository/system-setting.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadSystemSettingDetailResponseDto } from '../dto/response/read-system-setting-detail.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadSystemSettingDetailService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number) {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }
      // 시스템 설정 반환
      return ReadSystemSettingDetailResponseDto.from(systemSetting);
    });
  }
}
