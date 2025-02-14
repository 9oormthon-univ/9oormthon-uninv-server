import { ERole } from '../../core/enums/role.enum';
import { TeamModel } from './team.model';
import { UserModel } from '../../user/domain/user.model';

export class MemberModel {
  constructor(
    public readonly id: number,
    public readonly role: ERole,
    public readonly user: UserModel,
    public readonly team: TeamModel,
    public readonly createdAt: Date
  ) {}

  static createMember(
    role: ERole,
    user: UserModel,
    team: TeamModel
  ): MemberModel {
    return new MemberModel(
      null,
      role,
      user,
      team,
      new Date()
    );
  }
}