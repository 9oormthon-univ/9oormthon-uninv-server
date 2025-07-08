import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { SystemSettingRepository } from '../../repository/system-setting.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepository } from '../../../user/repository/user.repository';
import { UpdateMaxIdeaNumberRequestDto } from '../dto/request/update-max-idea-number.request.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateMaxIdeaNumberService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto: UpdateMaxIdeaNumberRequestDto): Promise<void> {
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

      // 최대 아이디어 수 업데이트
      const updatedSystemSetting = systemSetting.updateMaxIdeaNumber(requestDto.maxIdeaNumber);

      await this.systemSettingRepository.save(updatedSystemSetting, manager);
    });
  }
}