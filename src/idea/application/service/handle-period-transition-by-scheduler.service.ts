import { Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { MemberRepository } from '../../../team/repository/member.repository';
import { Cron } from '@nestjs/schedule';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { EApplyStatus } from '../../../core/enums/apply-status.enum';
import { ApplyModel } from '../../domain/apply.model';
import { MemberModel } from '../../../team/domain/member.model';
import { TeamRepository } from '../../../team/repository/team.repository';
import { ETeamStatus } from '../../../core/enums/team-status.enum';
import { TeamModel } from '../../../team/domain/team.model';
import { EPeriod } from '../../../core/enums/period.enum';
import { ApplyMapper } from '../../../core/infra/mapper/apply.mapper';
import { ApplyEntity } from '../../../core/infra/entities/apply.entity';

@Injectable()
export class HandlePeriodTransitionBySchedulerService {
  private readonly logger = new Logger(HandlePeriodTransitionBySchedulerService.name);

  constructor(
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource,
  ) {}


  @Cron('*/3 * * * *')
  async testFlowScheduler(): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const now = new Date();

      // 날짜 포맷 도우미
      const format = (date: Date) =>
        `${date.getFullYear()}년${date.getMonth() + 1}월${date.getDate()}일 ${date.getHours()}시${date.getMinutes()}분`;

      const currentSystemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!currentSystemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      switch (currentSystemSetting.getWhichPeriod()) {
        case EPeriod.IDEA_SUBMISSION:
          this.logger.log(`아이디어 제시 기간 입니다. ${format(currentSystemSetting.ideaSubmissionStart)} ~ ${format(currentSystemSetting.ideaSubmissionEnd)}`);
          break;
        case EPeriod.PHASE1_TEAM_BUILDING:
          this.logger.log(`1차 팀빌딩 기간입니다. ${format(currentSystemSetting.phase1TeamBuildingStart)} ~ ${format(currentSystemSetting.phase1TeamBuildingEnd)}`);
          break;
        case EPeriod.PHASE1_CONFIRMATION:
          this.logger.log(`1차 팀빌딩 확정 기간입니다. ${format(currentSystemSetting.phase1ConfirmationStart)} ~ ${format(currentSystemSetting.phase1ConfirmationEnd)}`);
          break;
        case EPeriod.PHASE2_TEAM_BUILDING:
          await this.processConfirmationTransition(Number(process.env.GENERATION), 1, manager);
          this.logger.log('1차 팀빌딩 확정이 완료되었습니다. 로직이 처리되었습니다.');
          this.logger.log(`2차 팀빌딩 기간입니다. ${format(currentSystemSetting.phase2TeamBuildingStart)} ~ ${format(currentSystemSetting.phase2TeamBuildingEnd)}`);
          break;
        case EPeriod.PHASE2_CONFIRMATION:
          this.logger.log(`2차 팀빌딩 확정 기간입니다. ${format(currentSystemSetting.phase2ConfirmationStart)} ~ ${format(currentSystemSetting.phase2ConfirmationEnd)}`);
          break;
        case EPeriod.PHASE3_TEAM_BUILDING:
          await this.processConfirmationTransition(Number(process.env.GENERATION), 2, manager);
          this.logger.log('2차 팀빌딩 확정이 완료되었습니다. 로직이 처리되었습니다.');
          this.logger.log(`3차 팀빌딩 기간입니다. ${format(currentSystemSetting.phase3TeamBuildingStart)} ~ ${format(currentSystemSetting.phase3TeamBuildingEnd)}`);
          break;
        case EPeriod.PHASE3_CONFIRMATION:
          this.logger.log(`3차 팀빌딩 확정 기간입니다. ${format(currentSystemSetting.phase3ConfirmationStart)} ~ ${format(currentSystemSetting.phase3ConfirmationEnd)}`);
          break;
        case EPeriod.HACKATHON:
          await this.processConfirmationTransition(Number(process.env.GENERATION), 3, manager);
          this.logger.log('3차 팀빌딩 확정이 완료되었습니다. 로직이 처리되었습니다.');
          this.logger.log(`해커톤 기간입니다. ${format(currentSystemSetting.hackathonStart)} ~ ${format(currentSystemSetting.hackathonEnd)}`);
          break;
        case EPeriod.NONE:
          this.logger.log('모든 사이클이 완료되었습니다. 시스템 설정을 초기화하고 3 분 뒤 아이디어 제시 기간이 다시 시작됩니다.');
          // 시스템 설정 초기화
          const updatedSetting = currentSystemSetting.updateDatesByTest(
            new Date(now.getTime() + 3 * 60000), // IDEA_SUBMISSION 시작
            new Date((now.getTime() + 6 * 60000) - 1000), // IDEA_SUBMISSION 종료
            new Date(now.getTime() + 6 * 60000), // PHASE1_TEAM_BUILDING 시작
            new Date((now.getTime() + 9 * 60000) - 1000), // PHASE1_TEAM_BUILDING 종료
            new Date(now.getTime() + 9 * 60000), // PHASE1_CONFIRMATION 시작
            new Date((now.getTime() + 12 * 60000) - 1000), // PHASE1_CONFIRMATION 종료
            new Date(now.getTime() + 12 * 60000), // PHASE2_TEAM_BUILDING 시작
            new Date((now.getTime() + 15 * 60000) - 1000), // PHASE2_TEAM_BUILDING 종료
            new Date(now.getTime() + 15 * 60000), // PHASE2_CONFIRMATION 시작
            new Date((now.getTime() + 18 * 60000) - 1000), // PHASE2_CONFIRMATION 종료
            new Date(now.getTime() + 18 * 60000), // PHASE3_TEAM_BUILDING 시작
            new Date((now.getTime() + 21 * 60000) - 1000), // PHASE3_TEAM_BUILDING 종료
            new Date(now.getTime() + 21 * 60000), // PHASE3_CONFIRMATION 시작
            new Date((now.getTime() + 24 * 60000) - 1000), // PHASE3_CONFIRMATION 종료
            new Date(now.getTime() + 24 * 60000), // HACKATHON 시작
            new Date((now.getTime() + 27 * 60000) - 1000), // HACKATHON 종료
          )
          await this.systemSettingRepository.save(updatedSetting, manager);
      }
    });
  }

  // TODO: 테스트 끝나고 주석 해제
  // @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  // async handlePeriodTransitions(): Promise<void> {
  //   return this.dataSource.transaction(async (manager) => {
  //
  //     // 시스템 설정 조회
  //     const systemSetting = await this.systemSettingRepository.findFirst(manager);
  //     if (!systemSetting) {
  //       throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
  //     }
  //
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);
  //
  //     // 특정 end 날짜의 하루 뒤가 오늘인지 확인
  //     const isDayAfter = (endDate: Date): boolean => {
  //       const nextDay = new Date(endDate);
  //       nextDay.setHours(0, 0, 0, 0);
  //       nextDay.setDate(nextDay.getDate() + 1);
  //       return today.getTime() === nextDay.getTime();
  //     };
  //
  //     // Phase1ConfirmationEnd의 하루 뒤인 경우
  //     if (isDayAfter(systemSetting.phase1ConfirmationEnd)) {
  //       await this.processConfirmationTransition(Number(process.env.GENERATION), 1, manager);
  //     }
  //
  //     // Phase2ConfirmationEnd의 하루 뒤인 경우
  //     if (isDayAfter(systemSetting.phase2ConfirmationEnd)) {
  //       await this.processConfirmationTransition(Number(process.env.GENERATION), 2, manager);
  //     }
  //
  //     // Phase3ConfirmationEnd의 하루 뒤인 경우
  //     if (isDayAfter(systemSetting.phase3ConfirmationEnd)) {
  //       await this.processConfirmationTransition(Number(process.env.GENERATION), 3, manager);
  //     }
  //
  //     this.logger.log('------------기간 전환 처리 완료. 로직 처리 이후, ' + systemSetting.getWhichPeriod() + '로 변경됨. ------------');
  //   });
  // }

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
    // 트랜잭션 매니저에서 직접 Repository 뽑기
    const repo = manager.getRepository(ApplyEntity);

    // relations는 필요한 것만 유지 (너무 깊은 relations는 성능 및 오류의 원인)
    const entities = await repo.find({
      where: { idea: { generation }, phase },
      relations: [
        'user',
        'user.univ',
        'idea',
        'idea.provider',
        'idea.ideaSubject',
        'idea.team',
        'idea.team.members',
      ],
    });

    if (!entities || entities.length === 0) {
      this.logger.log(`generation: ${generation}, phase:${phase}에 대한 Apply가 없습니다.`);
      return;
    }

    // Entity → Domain 모델 매핑
    const applies = ApplyMapper.toDomains(entities);

    // 2. WAITING 상태의 Apply들은 REJECTED로 변경
    for (const apply of applies) {
      if (apply.status === EApplyStatus.WAITING) {
        const updatedApply = apply.reject();
        await repo.save(ApplyMapper.toEntity(updatedApply));
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
      await repo.save(ApplyMapper.toEntity(updatedApply));
      // member 생성
      const member = MemberModel.createMember(
        confirmedApply.role,
        false,
        confirmedApply.user,
        confirmedApply.idea.team,
      );

      await this.memberRepository.save(member, manager);

      // 인원이 최대 인원 수 이상을 갖춘 팀의 경우, 팀 상태를 END로 변경
      if (confirmedApply.idea.team.members.length >= TeamModel.MAX_TOTAL_CAPACITY) {
        const updatedConfirmedApply = confirmedApply.idea.team.updateStatus(ETeamStatus.END);
        await this.teamRepository.save(updatedConfirmedApply.idea.team, manager);
      }

      // 동일 사용자에 대해 두 번째 이후의 Apply는 ACCEPTED_NOT_JOINED로 업데이트
      for (let i = 1; i < userApplies.length; i++) {
        const updatedApply = userApplies[i].acceptedNotJoined();
        await repo.save(ApplyMapper.toEntity(updatedApply));
      }
    }
  }
}