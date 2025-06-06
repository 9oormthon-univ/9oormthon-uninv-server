import { ERole } from '../../../../core/enums/role.enum';

export class MemberOverviewDto {
  id: number;
  user_id: number;
  name: string;
  role: ERole;
  univ: string;
  email: string;
  is_leader: boolean;

  constructor(
    id: number,
    user_id: number,
    name: string,
    role: ERole,
    univ: string,
    email: string,
    is_leader: boolean
  ) {
    this.id = id;
    this.user_id = user_id;
    this.name = name;
    this.role = role;
    this.univ = univ;
    this.email = email;
    this.is_leader = is_leader;
  }
}

export class ReadMemberOverviewResponseDto {
  members: MemberOverviewDto[];

  constructor(members: MemberOverviewDto[]) {
    this.members = members;
  }

  static of(members: MemberOverviewDto[]): ReadMemberOverviewResponseDto {
    return new ReadMemberOverviewResponseDto(members);
  }
}