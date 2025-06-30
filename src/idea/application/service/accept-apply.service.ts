import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { IdeaRepository } from '../../repository/idea.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { TeamRepository } from '../../../team/repository/team.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AcceptApplyService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly teamRepository: TeamRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
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

      // 시스템 설정의 지원 수락/거절 기간 확인
      systemSetting.validateAcceptOrRejectApplyPeriod(apply.phase);

      // 유저의 아이디어 조회
      const idea = await this.ideaRepository.findByUserIdAndGeneration(userId, apply.idea.generation, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_PROVIDER_ERROR);
      }

      // 지원 정보의 아이디어와 유저의 아이디어가 일치하는지 확인
      if (idea.id !== apply.idea.id) {
        throw new CommonException(ErrorCode.NOT_MATCH_IDEA_ERROR);
      }

      // 유저의 팀 조회
      const team = await this.teamRepository.findWithMembersByUserIdAndGeneration(userId, apply.idea.generation, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 현재 페이즈의 모든 지원 정보 조회
      const applies = await this.applyRepository.findByIdeaIdAndPhase(userId, apply.idea.generation, manager);

      // 수락하려는 직군의 인원 수가, 현재 팀의 해당 직군 인원 수 + 이미 수락한 해당 직군의 인원수 + 1 보다 크면 예외 발생
      const roleCount = applies.filter(a => a.role === apply.role).length + team.getMemberCountByRole(apply.role) + 1;
      if (roleCount > team.getRoleCapacity(apply.role)) {
        throw new CommonException(ErrorCode.APPLY_ROLE_CAPACITY_ERROR);
      }

      // 지원 정보의 상태를 ACCEPT 로 변경
      const updatedApply = apply.accept();

      // 지원 정보 저장
      await this.applyRepository.save(updatedApply, manager);
    });
  }
}