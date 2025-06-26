import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { UserRepository } from '../../../user/repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadAdminIdeaDetailResponseDto } from '../dto/response/read-admin-idea-detail.response.dto';
import { ApplyRepository } from '../../repository/apply.repository';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAdminIdeaDetailService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly userRepository: UserRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, ideaId: number): Promise<ReadAdminIdeaDetailResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 아이디어 조회
      const idea = await this.ideaRepository.findAdminIdeaDetail(ideaId, manager);
      if(!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 아이디어에 대한 지원 조회
      const applies = await this.applyRepository.findByIdeaIdAndPhase(idea.id, systemSetting.getWhichPhase(), manager);

      return ReadAdminIdeaDetailResponseDto.of(
        idea,
        idea.team,
        applies
      )
    });
  }
}