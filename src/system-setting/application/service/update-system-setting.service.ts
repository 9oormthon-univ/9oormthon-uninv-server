import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { SystemSettingRepository } from '../../repository/system-setting.repository';
import { DataSource } from 'typeorm';
import { UpdateSystemSettingRequestDto } from '../dto/request/update-system-setting.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepository } from '../../../user/repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateSystemSettingService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto: UpdateSystemSettingRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if(!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 시스템 설정 업데이트
      const updatedSystemSetting = systemSetting.updateDates(
        requestDto.ideaSubmissionStart,
        requestDto.ideaSubmissionEnd,
        requestDto.phase1TeamBuildingStart,
        requestDto.phase1TeamBuildingEnd,
        requestDto.phase1ConfirmationStart,
        requestDto.phase1ConfirmationEnd,
        requestDto.phase2TeamBuildingStart,
        requestDto.phase2TeamBuildingEnd,
        requestDto.phase2ConfirmationStart,
        requestDto.phase2ConfirmationEnd,
        requestDto.phase3TeamBuildingStart,
        requestDto.phase3TeamBuildingEnd,
        requestDto.phase3ConfirmationStart,
        requestDto.phase3ConfirmationEnd
      );
      await this.systemSettingRepository.save(updatedSystemSetting, manager);
    });
  }
}