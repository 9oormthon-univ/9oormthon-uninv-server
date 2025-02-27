import { ERole } from '../../../../core/enums/role.enum';
import { EApplyStatus } from '../../../../core/enums/apply-status.enum';
import { ApplyModel } from '../../../domain/apply.model';
import { UserModel } from '../../../../user/domain/user.model';

export class UserDto {
  id: number;
  name: string;
  univ: string;

  constructor(id: number, name: string, univ: string) {
    this.id = id;
    this.name = name;
    this.univ = univ;
  }

  static of(user: UserModel): UserDto {
    return new UserDto(user.id, user.name, user.univ.name);
  }
}

export class ApplyOverviewDto {
  id: number;
  preference: number;
  motivation: string;
  role: ERole;
  status: EApplyStatus;
  user: UserDto;

  constructor(id: number, preference: number, motivation: string, role: ERole, status: EApplyStatus, user: UserDto) {
    this.id = id;
    this.preference = preference;
    this.motivation = motivation;
    this.role = role;
    this.status = status;
    this.user = user;
  }

  static of(apply: ApplyModel): ApplyOverviewDto {
    return new ApplyOverviewDto(apply.id, apply.preference, apply.motivation, apply.role, apply.status, UserDto.of(apply.user));
  }
}

export class ReadTeamApplyOverviewResponseDto {
  applies: ApplyOverviewDto[];

  constructor(applies: ApplyOverviewDto[]) {
    this.applies = applies;
  }

  static from(applies: ApplyModel[]): ReadTeamApplyOverviewResponseDto {
    return new ReadTeamApplyOverviewResponseDto(applies !== null && applies.length !== 0 ? applies.map(apply => ApplyOverviewDto.of(apply)) : null);
  }
}