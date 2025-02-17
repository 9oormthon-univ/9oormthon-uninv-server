import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';

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

  public getWhichPeriod(): string {
    const now = new Date();
    if (this.ideaSubmissionStart <= now && now <= this.ideaSubmissionEnd) {
      return 'ideaSubmission';
    } else if (this.phase1TeamBuildingStart <= now && now <= this.phase1TeamBuildingEnd) {
      return 'phase1TeamBuilding';
    } else if (this.phase1ConfirmationStart <= now && now <= this.phase1ConfirmationEnd) {
      return 'phase1Confirmation';
    } else if (this.phase2TeamBuildingStart <= now && now <= this.phase2TeamBuildingEnd) {
      return 'phase2TeamBuilding';
    } else if (this.phase2ConfirmationStart <= now && now <= this.phase2ConfirmationEnd) {
      return 'phase2Confirmation';
    } else if (this.phase3TeamBuildingStart <= now && now <= this.phase3TeamBuildingEnd) {
      return 'phase3TeamBuilding';
    } else if (this.phase3ConfirmationStart <= now && now <= this.phase3ConfirmationEnd) {
      return 'phase3Confirmation';
    } else {
      return 'none';
    }
  }

  public validateIdeaApplyPeriod(phase: number): void {
    const now = new Date();
    if (
      !(
        (this.phase1TeamBuildingStart <= now && now <= this.phase1TeamBuildingEnd) ||
        (this.phase2TeamBuildingStart <= now && now <= this.phase2TeamBuildingEnd) ||
        (this.phase3TeamBuildingStart <= now && now <= this.phase3TeamBuildingEnd)
      )
    ) {
      throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
    // phase 와 현재 기간 불일치시 예외처리
    if (this.getWhichPeriod() !== `phase${phase}TeamBuilding`) {
      throw new CommonException(ErrorCode.NOT_IDEA_APPLY_PERIOD_ERROR);
    }
  }
}


