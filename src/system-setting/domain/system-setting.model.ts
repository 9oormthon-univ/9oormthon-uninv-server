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
      this.getWhichPeriod() !== EPeriod.PHASE1_TEAM_BUILDING ||
      this.getWhichPeriod() !== EPeriod.PHASE2_TEAM_BUILDING ||
      this.getWhichPeriod() !== EPeriod.PHASE3_TEAM_BUILDING ||
      this.getWhichPeriod() !== EPeriod.fromPhase(phase)
    ) {
      Logger.log("에러 발생. getWhichPeriod() : " + this.getWhichPeriod() + " fromPhase(phase) : " + EPeriod.fromPhase(phase));
      throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
  }
}


