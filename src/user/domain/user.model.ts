import { ESecurityRole } from '../../core/enums/security-role.enum';
import { UnivModel } from './univ.model';
import { CommonException } from '../../core/exceptions/common.exception';
import { ErrorCode } from '../../core/exceptions/error-code';
import { ELinkType } from '../../core/enums/link-type.enum';
import { LinkModel } from './link.model';

export class UserModel {
  constructor(
    public readonly id: number,
    public readonly serialId: string,
    public readonly password: string,
    public readonly imgUrl: string,
    public readonly name: string,
    public readonly phoneNumber: string,
    public readonly introduction: string,
    public readonly generations: string[],
    public readonly stacks: string[],
    public readonly links: LinkModel[],
    public readonly refreshToken: string | null,
    public readonly role: ESecurityRole,
    public readonly univ: UnivModel,
    public readonly createdAt: Date
  ) {}

  static createAdmin(
    serialId: string,
    password: string
  ) : UserModel {
    return new UserModel(
      null,
      serialId,
      password,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      ESecurityRole.ADMIN,
      null,
      new Date()
    );
  }

  static createUser(
    serialId: string,
    password: string,
    imgUrl: string,
    name: string,
    phoneNumber: string,
    generations: string[],
    univ: UnivModel
  ) : UserModel {
    return new UserModel(
      null,
      serialId,
      password,
      imgUrl,
      name,
      phoneNumber,
      null,
      generations,
      null,
      null,
      null,
      ESecurityRole.USER,
      univ,
      new Date()
    );
  }

  public updateUser(
    imgUrl: string,
    introduction: string,
    stacks: string[],
    links: LinkModel[],
  ) : UserModel {
    return new UserModel(
      this.id,
      this.serialId,
      this.password,
      imgUrl,
      this.name,
      this.phoneNumber,
      introduction,
      this.generations,
      stacks,
      links,
      this.refreshToken,
      this.role,
      this.univ,
      this.createdAt
    );
  }

  public updatePassword(password: string): UserModel {
    return new UserModel(
      this.id,
      this.serialId,
      password,
      this.imgUrl,
      this.name,
      this.phoneNumber,
      this.introduction,
      this.generations,
      this.stacks,
      this.links,
      this.refreshToken,
      this.role,
      this.univ,
      this.createdAt
    );
  }

  public updateRefreshToken(refreshToken: string): UserModel {
    return new UserModel(
      this.id,
      this.serialId,
      this.password,
      this.imgUrl,
      this.name,
      this.phoneNumber,
      this.introduction,
      this.generations,
      this.stacks,
      this.links,
      refreshToken,
      this.role,
      this.univ,
      this.createdAt
    );
  }

  public validateAdminRole(): void {
    if (this.role !== ESecurityRole.ADMIN) {
      throw new CommonException(ErrorCode.ACCESS_DENIED);
    }
  }
}