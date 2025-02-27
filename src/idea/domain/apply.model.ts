import { EApplyStatus } from '../../core/enums/apply-status.enum';
import { ERole } from '../../core/enums/role.enum';
import { UserModel } from '../../user/domain/user.model';
import { IdeaModel } from './idea.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';

export class ApplyModel {
  constructor(
    public readonly id: number,
    public readonly phase: number,
    public readonly status: EApplyStatus,
    public readonly preference: number,
    public readonly motivation: string,
    public readonly role: ERole,
    public readonly user: UserModel,
    public readonly idea: IdeaModel,
    public readonly createdAt: Date,
  ) {
  }

  static createApply(
    phase: number,
    preference: number,
    motivation: string,
    role: ERole,
    user: UserModel,
    idea: IdeaModel
  ): ApplyModel {
    return new ApplyModel(
      null,
      phase,
      EApplyStatus.WAITING,
      preference,
      motivation,
      role,
      user,
      idea,
      new Date()
    );
  }

  public accept(): ApplyModel {
    if (this.status !== EApplyStatus.WAITING) {
      throw new CommonException(ErrorCode.APPLY_STATUS_ERROR);
    }
    return new ApplyModel(
      this.id,
      this.phase,
      EApplyStatus.ACCEPTED,
      this.preference,
      this.motivation,
      this.role,
      this.user,
      this.idea,
      this.createdAt
    );
  }

  public reject(): ApplyModel {
    if (this.status !== EApplyStatus.WAITING) {
      throw new CommonException(ErrorCode.APPLY_STATUS_ERROR);
    }
    return new ApplyModel(
      this.id,
      this.phase,
      EApplyStatus.REJECTED,
      this.preference,
      this.motivation,
      this.role,
      this.user,
      this.idea,
      this.createdAt
    );
  }

  public confirm(): ApplyModel {
    if (this.status !== EApplyStatus.ACCEPTED) {
      throw new CommonException(ErrorCode.APPLY_STATUS_ERROR);
    }
    return new ApplyModel(
      this.id,
      this.phase,
      EApplyStatus.CONFIRMED,
      this.preference,
      this.motivation,
      this.role,
      this.user,
      this.idea,
      this.createdAt
    );
  }

  public acceptedNotJoined(): ApplyModel {
    if (this.status !== EApplyStatus.ACCEPTED) {
      throw new CommonException(ErrorCode.APPLY_STATUS_ERROR);
    }
    return new ApplyModel(
      this.id,
      this.phase,
      EApplyStatus.ACCEPTED_NOT_JOINED,
      this.preference,
      this.motivation,
      this.role,
      this.user,
      this.idea,
      this.createdAt
    );
  }
}