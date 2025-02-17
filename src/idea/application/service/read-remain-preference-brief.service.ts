import { ReadRemainPreferenceBriefUseCase } from '../usecase/read-remain-preference-brief.usecase';
import { ReadRemainPreferenceBriefRequestDto } from '../dto/request/read-remain-preference-brief.request.dto';
import { ReadRemainPreferenceBriefResponseDto } from '../dto/response/read-remain-preference-brief.response.dto';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ApplyRepositoryImpl } from '../../repository/apply.repository.impl';
import { SystemSettingRepositoryImpl } from '../../../system-setting/repository/system-setting.repository.impl';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CommonException } from '../../../core/exceptions/common.exception';
import { DataSource } from 'typeorm';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadRemainPreferenceBriefService implements ReadRemainPreferenceBriefUseCase {
  constructor(
    private readonly applyRepository: ApplyRepositoryImpl,
    private readonly systemSettingRepository: SystemSettingRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}


  async execute(userId: number, requestDto: ReadRemainPreferenceBriefRequestDto): Promise<ReadRemainPreferenceBriefResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const applies = await this.applyRepository.findByUserIdAndGenerationAndPhase(userId, requestDto.generation, requestDto.phase, manager);

      const systemSetting = await this.systemSettingRepository.findFirst(manager);

      return ReadRemainPreferenceBriefResponseDto.of(applies, systemSetting.maxPreferencesPerUser);
    });
  }
}