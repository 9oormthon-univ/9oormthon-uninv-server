import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';
import { Logger } from '@nestjs/common';
import { EPeriod } from '../../core/enums/period.enum';

export class SystemSettingModel {
  constructor(
    public readonly id: number,
    public readonly ideaSubmissionStart: Date,
    public readonly ideaSubmissionEnd: Date,
    public readonly phase1TeamBuildingStart: Date,
    public readonly phase1TeamBuildingEnd: Date,
    public readonly phase1ConfirmationStart: Date,
    public readonly phase1ConfirmationEnd: Date,
    public readonly phase2TeamBuildingStart: Date,
    public readonly phase2TeamBuildingEnd: Date,
    public readonly phase2ConfirmationStart: Date,
    public readonly phase2ConfirmationEnd: Date,
    public readonly phase3TeamBuildingStart: Date,
    public readonly phase3TeamBuildingEnd: Date,
    public readonly phase3ConfirmationStart: Date,
    public readonly phase3ConfirmationEnd: Date,
    public readonly maxPreferencesPerUser: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  public updateDates(
    ideaSubmissionStart: Date,
    ideaSubmissionEnd: Date,
    phase1TeamBuildingStart: Date,
    phase1TeamBuildingEnd: Date,
    phase1ConfirmationStart: Date,
    phase1ConfirmationEnd: Date,
    phase2TeamBuildingStart: Date,
    phase2TeamBuildingEnd: Date,
    phase2ConfirmationStart: Date,
    phase2ConfirmationEnd: Date,
    phase3TeamBuildingStart: Date,
    phase3TeamBuildingEnd: Date,
    phase3ConfirmationStart: Date,
    phase3ConfirmationEnd: Date
  ): SystemSettingModel {
    // 1. start 날짜는 반드시 00:00:00이어야 함.
    const checkStartTime = (date: Date) => {
      if (date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0) {
        throw new CommonException(ErrorCode.INVALID_START_TIME_ERROR);
      }
    };

    // 2. end 날짜는 반드시 23:59:59이어야 함.
    const checkEndTime = (date: Date) => {
      if (date.getHours() !== 23 || date.getMinutes() !== 59 || date.getSeconds() !== 59) {
        throw new CommonException(ErrorCode.INVALID_END_TIME_ERROR);
      }
    };

    // 3. 이전 end와 다음 start가 연속(1초 차이)인지 검사
    const checkConsecutive = (prevEnd: Date, nextStart: Date) => {
      if (nextStart.getTime() - prevEnd.getTime() !== 1000) {
        throw new CommonException(
          ErrorCode.NON_CONSECUTIVE_PERIOD_ERROR
        );
      }
    };

    // 4. 전체 기간 순서가 올바른지 검사
    const checkOrder = (dates: Date[]) => {
      for (let i = 0; i < dates.length - 1; i++) {
        if (dates[i].getTime() >= dates[i + 1].getTime()) {
          throw new CommonException(
            ErrorCode.INVALID_DATE_ORDER_ERROR
          );
        }
      }
    };

    // 각 start, end 필드에 대해 시간 체크
    Logger.log("ideaSubmissionStart: " + ideaSubmissionStart);
    checkStartTime(ideaSubmissionStart);
    checkEndTime(ideaSubmissionEnd);

    checkStartTime(phase1TeamBuildingStart);
    checkEndTime(phase1TeamBuildingEnd);

    checkStartTime(phase1ConfirmationStart);
    checkEndTime(phase1ConfirmationEnd);

    checkStartTime(phase2TeamBuildingStart);
    checkEndTime(phase2TeamBuildingEnd);

    checkStartTime(phase2ConfirmationStart);
    checkEndTime(phase2ConfirmationEnd);

    checkStartTime(phase3TeamBuildingStart);
    checkEndTime(phase3TeamBuildingEnd);

    checkStartTime(phase3ConfirmationStart);
    checkEndTime(phase3ConfirmationEnd);

    // 연속성 검사 (각 기간의 end와 다음 기간의 start가 정확히 1초 차이인지)
    checkConsecutive(ideaSubmissionEnd, phase1TeamBuildingStart);
    checkConsecutive(phase1TeamBuildingEnd, phase1ConfirmationStart);
    checkConsecutive(phase1ConfirmationEnd, phase2TeamBuildingStart);
    checkConsecutive(phase2TeamBuildingEnd, phase2ConfirmationStart);
    checkConsecutive(phase2ConfirmationEnd, phase3TeamBuildingStart);
    checkConsecutive(phase3TeamBuildingEnd, phase3ConfirmationStart);

    // 전체 기간 순서 검사
    const dates = [
      ideaSubmissionStart,
      ideaSubmissionEnd,
      phase1TeamBuildingStart,
      phase1TeamBuildingEnd,
      phase1ConfirmationStart,
      phase1ConfirmationEnd,
      phase2TeamBuildingStart,
      phase2TeamBuildingEnd,
      phase2ConfirmationStart,
      phase2ConfirmationEnd,
      phase3TeamBuildingStart,
      phase3TeamBuildingEnd,
      phase3ConfirmationStart,
      phase3ConfirmationEnd,
    ];
    const names = [
      'ideaSubmissionStart',
      'ideaSubmissionEnd',
      'phase1TeamBuildingStart',
      'phase1TeamBuildingEnd',
      'phase1ConfirmationStart',
      'phase1ConfirmationEnd',
      'phase2TeamBuildingStart',
      'phase2TeamBuildingEnd',
      'phase2ConfirmationStart',
      'phase2ConfirmationEnd',
      'phase3TeamBuildingStart',
      'phase3TeamBuildingEnd',
      'phase3ConfirmationStart',
      'phase3ConfirmationEnd',
    ];
    checkOrder(dates);

    return new SystemSettingModel(
      this.id,
      ideaSubmissionStart,
      ideaSubmissionEnd,
      phase1TeamBuildingStart,
      phase1TeamBuildingEnd,
      phase1ConfirmationStart,
      phase1ConfirmationEnd,
      phase2TeamBuildingStart,
      phase2TeamBuildingEnd,
      phase2ConfirmationStart,
      phase2ConfirmationEnd,
      phase3TeamBuildingStart,
      phase3TeamBuildingEnd,
      phase3ConfirmationStart,
      phase3ConfirmationEnd,
      this.maxPreferencesPerUser,
      this.createdAt,
      new Date()
    );
  }

  public getWhichPeriod(): EPeriod {
    const now = new Date();
    Logger.log("현재 시간은!!!!!!!!!! : " + now);
    if (this.ideaSubmissionStart <= now && now <= this.ideaSubmissionEnd) {
      return EPeriod.IDEA_SUBMISSION;
    } else if (this.phase1TeamBuildingStart <= now && now <= this.phase1TeamBuildingEnd) {
      return EPeriod.PHASE1_TEAM_BUILDING;
    } else if (this.phase1ConfirmationStart <= now && now <= this.phase1ConfirmationEnd) {
      return EPeriod.PHASE1_CONFIRMATION;
    } else if (this.phase2TeamBuildingStart <= now && now <= this.phase2TeamBuildingEnd) {
      return EPeriod.PHASE2_TEAM_BUILDING;
    } else if (this.phase2ConfirmationStart <= now && now <= this.phase2ConfirmationEnd) {
      return EPeriod.PHASE2_CONFIRMATION;
    } else if (this.phase3TeamBuildingStart <= now && now <= this.phase3TeamBuildingEnd) {
      return EPeriod.PHASE3_TEAM_BUILDING;
    } else if (this.phase3ConfirmationStart <= now && now <= this.phase3ConfirmationEnd) {
      return EPeriod.PHASE3_CONFIRMATION;
    } else {
      return EPeriod.NONE;
    }
  }

  public validateIdeaApplyPeriod(phase: number): void {
    Logger.log("현재 기간은!!!!!!!!!! : " + this.getWhichPeriod());
    if (
      (
        (this.getWhichPeriod() !== EPeriod.PHASE1_TEAM_BUILDING) &&
        (this.getWhichPeriod() !== EPeriod.PHASE2_TEAM_BUILDING) &&
        (this.getWhichPeriod() !== EPeriod.PHASE3_TEAM_BUILDING)
      ) || this.getWhichPeriod() !== EPeriod.fromPhase(phase)
    ) {
      Logger.log("에러 발생. getWhichPeriod() : " + this.getWhichPeriod() + " fromPhase(phase) : " + EPeriod.fromPhase(phase));
      throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
  }

  public validateDeleteApplyPeriod(phase: number): void {
    if (this.getWhichPeriod() !== EPeriod.PHASE1_TEAM_BUILDING && this.getWhichPeriod() !== EPeriod.PHASE2_TEAM_BUILDING && this.getWhichPeriod() !== EPeriod.PHASE3_TEAM_BUILDING) {
      throw new CommonException(ErrorCode.NOT_APPLY_DELETE_PERIOD_ERROR);
    }

    if (this.getWhichPeriod() !== EPeriod.fromPhase(phase)) {
      throw new CommonException(ErrorCode.NOT_APPLY_DELETE_PERIOD_ERROR);
    }
  }

  public validateAcceptOrRejectApplyPeriod(phase: number): void {
    if (this.getWhichPeriod() !== EPeriod.PHASE1_CONFIRMATION || this.getWhichPeriod() !== EPeriod.PHASE2_CONFIRMATION || this.getWhichPeriod() !== EPeriod.PHASE3_CONFIRMATION) {
      throw new CommonException(ErrorCode.NOT_APPLY_ACCEPT_OR_REJECT_PERIOD_ERROR);
    }

    if (this.getWhichPeriod() !== EPeriod.fromPhase(phase)) {
      throw new CommonException(ErrorCode.NOT_APPLY_ACCEPT_OR_REJECT_PERIOD_ERROR);
    }
  }
}


