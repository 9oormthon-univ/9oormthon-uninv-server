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
  ) {}
}