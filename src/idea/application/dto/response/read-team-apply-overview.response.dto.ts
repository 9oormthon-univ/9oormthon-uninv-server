import { ERole } from '../../../../core/enums/role.enum';
import { EApplyStatus } from '../../../../core/enums/apply-status.enum';
import { ApplyModel } from '../../../domain/apply.model';
import { UserModel } from '../../../../user/domain/user.model';

export class ApplyOverviewDto {
  id: number;
  preference: number;
  motivation: string;
  name: string;
  role: ERole;
  status: EApplyStatus;
  univ: string;

  constructor(id: number, preference: number, motivation: string, name: string, role: ERole, status: EApplyStatus, univ: string) {
    this.id = id;
    this.preference = preference;
    this.motivation = motivation;
    this.name = name;
    this.role = role;
    this.status = status;
    this.univ = univ;
  }

  static of(apply: ApplyModel): ApplyOverviewDto {
    return new ApplyOverviewDto(apply.id, apply.preference, apply.motivation, apply.user.name, apply.role, apply.status, apply.user.univ.name);
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