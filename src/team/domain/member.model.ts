import { ERole } from '../../core/enums/role.enum';
import { TeamModel } from './team.model';
import { UserModel } from '../../user/domain/user.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';

export class MemberModel {
  constructor(
    public readonly id: number,
    public readonly role: ERole,
    public readonly isLeader: boolean,
    public readonly user: UserModel,
    public readonly team: TeamModel,
    public readonly createdAt: Date
  ) {}

  static createMember(
    role: ERole,
    isLeader: boolean,
    user: UserModel,
    team: TeamModel
  ): MemberModel {
    return new MemberModel(
      null,
      role,
      isLeader,
      user,
      team,
      new Date()
    );
  }

  public changeRole(
    role: ERole
  ): MemberModel {
    return new MemberModel(
      this.id,
      role,
      this.isLeader,
      this.user,
      this.team,
      this.createdAt
    );
  }

  public validateIsLeader(): void {
    if (!this.isLeader) {
      throw new CommonException(ErrorCode.NOT_TEAM_LEADER_ERROR);
    }
  }
}