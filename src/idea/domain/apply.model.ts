import { EApplyStatus } from '../../core/enums/apply-status.enum';
import { ERole } from '../../core/enums/role.enum';
import { UserModel } from '../../user/domain/user.model';
import { IdeaModel } from './idea.model';

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
}