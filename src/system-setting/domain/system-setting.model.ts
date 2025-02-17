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

  public validateIdeaApplyPeriod(): void {
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

  }
}


