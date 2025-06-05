import { Injectable, Logger } from '@nestjs/common';
import { ApplyRepository } from '../../repository/apply.repository';
import { DataSource, EntityManager } from 'typeorm';
import { MemberRepository } from '../../../team/repository/member.repository';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { EApplyStatus } from '../../../core/enums/apply-status.enum';
import { ApplyModel } from '../../domain/apply.model';
import { MemberModel } from '../../../team/domain/member.model';
import { TeamRepository } from '../../../team/repository/team.repository';
import { ETeamStatus } from '../../../core/enums/team-status.enum';
import { TeamModel } from '../../../team/domain/team.model';

@Injectable()
export class HandlePeriodTransitionBySchedulerService {
  private readonly logger = new Logger(HandlePeriodTransitionBySchedulerService.name);

  constructor(
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handlePeriodTransitions(): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 특정 end 날짜의 하루 뒤가 오늘인지 확인
      const isDayAfter = (endDate: Date): boolean => {
        const nextDay = new Date(endDate);
        nextDay.setHours(0, 0, 0, 0);
        nextDay.setDate(nextDay.getDate() + 1);
        return today.getTime() === nextDay.getTime();
      };

      // Phase1ConfirmationEnd의 하루 뒤인 경우
      if (isDayAfter(systemSetting.phase1ConfirmationEnd)) {
        await this.processConfirmationTransition(Number(process.env.GENERATION), 1, manager);
      }

      // Phase2ConfirmationEnd의 하루 뒤인 경우
      if (isDayAfter(systemSetting.phase2ConfirmationEnd)) {
        await this.processConfirmationTransition(Number(process.env.GENERATION), 2, manager);
      }

      // Phase3ConfirmationEnd의 하루 뒤인 경우
      if (isDayAfter(systemSetting.phase3ConfirmationEnd)) {
        await this.processConfirmationTransition(Number(process.env.GENERATION), 3, manager);
      }

      this.logger.log('------------기간 전환 처리 완료. 로직 처리 이후, ' + systemSetting.getWhichPeriod() + '로 변경됨. ------------');
    });
  }

  /**
   * 해당 기수(generation)와 팀빌딩 차수(phase)에 해당하는 Apply들을 처리하는 로직
   *
   * 1. applyRepository.findByGenerationAndPhase(generation, phase)를 통해 모든 Apply 조회
   * 2. WAITING 상태의 Apply들을 모두 REJECTED로 업데이트
   * 3. ACCEPTED 상태의 Apply들을 사용자별로 그룹핑
   *    - 만약 동일 사용자의 Apply가 여러 건이면, preference가 가장 낮은(숫자가 1에 가까운) Apply의 상태를 CONFIRMED로,
   *      나머지는 ACCEPTED_NOT_JOINED로 업데이트하고, 각 경우에 대해 memberService.createMember()를 호출
   *    - 동일 사용자가 단 1건이라면 해당 Apply의 상태를 CONFIRMED로 업데이트하고 member를 생성
   */
  private async processConfirmationTransition(generation: number, phase: number, manager: EntityManager): Promise<void> {

    this.logger.log(`generation: ${generation}, phase: ${phase}에 대한 기간 전환 처리 시작`);

    // 1. 해당 generation, phase에 해당하는 Apply들을 조회
    const applies = await this.applyRepository.findByGenerationAndPhase(generation, phase, manager);
    if (applies == null || applies.length === 0) {
      this.logger.log(`generation: ${generation}, phase:${phase}에 대한 Apply가 없습니다.`);
      return;
    }

    // 2. WAITING 상태의 Apply들은 REJECTED로 변경
    for (const apply of applies) {
      if (apply.status === EApplyStatus.WAITING) {
        const updatedApply = apply.reject();
        await this.applyRepository.save(updatedApply, manager);
      }
    }

    // 3. ACCEPTED 상태의 Apply들 처리
    const acceptedApplies = applies.filter(apply => apply.status === EApplyStatus.ACCEPTED);
    if (acceptedApplies.length === 0) {
      this.logger.log(`generation: ${generation}, phase: ${phase}에 대한 ACCEPTED 상태의 Apply가 없어, 스케쥴러를 종료합니다.`);
      return;
    }

    // 그룹핑: user.id를 기준으로 그룹화 (여러 건이 있을 수 있음)
    const groupedByUser = acceptedApplies.reduce((acc, apply) => {
      const userId = apply.user.id;
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(apply);
      return acc;
    }, {} as Record<string, ApplyModel[]>);

    // 각 사용자 그룹별로 처리
    for (const userId in groupedByUser) {
      const userApplies = groupedByUser[userId];
      // preference가 낮은 순서로 정렬 (숫자가 작을수록 우선순위 높음)
      userApplies.sort((a, b) => a.preference - b.preference);
      // 첫 번째 Apply를 CONFIRMED로 변경
      const confirmedApply = userApplies[0];
      const updatedApply = confirmedApply.confirm();
      await this.applyRepository.save(updatedApply);
      // member 생성
      const member = MemberModel.createMember(
        confirmedApply.role,
        confirmedApply.user,
        confirmedApply.idea.team,
      );

      await this.memberRepository.save(member, manager);

      // 인원이 최대 인원 수 이상을 갖춘 팀의 경우, 팀 상태를 END로 변경
      if (confirmedApply.idea.team.members.length >= TeamModel.MAX_TOTAL_CAPACITY) {
        confirmedApply.idea.team.updateStatus(ETeamStatus.END);
      }
      await this.teamRepository.save(confirmedApply.idea.team, manager);

      // 동일 사용자에 대해 두 번째 이후의 Apply는 ACCEPTED_NOT_JOINED로 업데이트
      for (let i = 1; i < userApplies.length; i++) {
        const updatedApply = userApplies[i].acceptedNotJoined();
        await this.applyRepository.save(updatedApply, manager);
      }
    }
  }
}