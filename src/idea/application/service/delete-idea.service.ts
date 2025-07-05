import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { ApplyRepository } from '../../repository/apply.repository';
import { MemberRepository } from '../../../team/repository/member.repository';
import { EPeriod } from '../../../core/enums/period.enum';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteIdeaService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 내 아이디어가 아닐 경우 예외처리
      idea.validateIsProvider(userId);

      // 팀에 팀장을 제외한 멤버가 있는지 확인
      const members = await this.memberRepository.findByIdeaId(idea.id, manager);
      if ((members ?? []).length > 1) {
        throw new CommonException(ErrorCode.ALREADY_ANOTHER_MEMBER_IN_TEAM);
      }

      // 아이디어 등록기간이 아니라면, 현재 차수에 해당 아이디어에 대한 지원이 있는지 확인. 있다면 예외 발생
      if (systemSetting.getWhichPeriod() !== EPeriod.IDEA_SUBMISSION) {
        const apply = await this.applyRepository.findByIdeaIdAndPhase(ideaId, systemSetting.getWhichPhase(), manager);
        if ((apply ?? []).length > 0) {
          throw new CommonException(ErrorCode.ALREADY_APPLIER_IN_CURRENT_PHASE);
        }
      }

      await this.ideaRepository.delete(idea.id, manager);
    });
  }
}