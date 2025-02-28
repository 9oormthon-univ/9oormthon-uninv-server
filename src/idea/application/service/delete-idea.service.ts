import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteIdeaService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 아이디어 삭제 기간인지 확인
      systemSetting.validateDeleteIdeaPeriod();

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 내 아이디어가 아닐 경우 예외처리
      idea.validateIsProvider(userId);

      await this.ideaRepository.delete(idea.id, manager);
    });
  }
}