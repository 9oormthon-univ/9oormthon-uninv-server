import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ETeamStatus } from '../../../core/enums/team-status.enum';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { ApplyRepository } from '../../../idea/repository/apply.repository';
import { TeamModel } from '../../domain/team.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateTeamStatusService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, generation: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 팀 조회
      const team = await this.teamRepository.findByUserIdAndGeneration(userId, generation, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀 인원이 최소 인원보다 적은지 확인
      if (team.members.length < TeamModel.MIN_TOTAL_CAPACITY) {
        throw new CommonException(ErrorCode.MIN_TOTAL_CAPACITY_ERROR);
      }

      // 팀장 여부 확인
      const leader = team.members.filter(member => member.isLeader)[0];
      if (!leader || leader.user.id !== userId) {
        throw new CommonException(ErrorCode.NOT_TEAM_LEADER_ERROR);
      }

      // 현재 차수에 이미 지원자가 있는지 확인
      const apply = await this.applyRepository.findByIdeaIdAndPhase(team.idea.id, systemSetting.getWhichPhase(), manager);
      if (apply.length > 0) {
        throw new CommonException(ErrorCode.ALREADY_APPLIER_IN_CURRENT_PHASE);
      }

      // 팀 상태 업데이트
      team.updateStatus(ETeamStatus.END);
      await this.teamRepository.save(team, manager);
    });
  }
}