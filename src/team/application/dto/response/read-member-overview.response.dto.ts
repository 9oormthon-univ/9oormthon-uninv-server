import { ERole } from '../../../../core/enums/role.enum';

export class MemberOverviewDto {
  id: number;
  name: string;
  role: ERole;
  univ: string;
  email: string;

  constructor(
    id: number,
    name: string,
    role: ERole,
    univ: string,
    email: string
  ) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.univ = univ;
    this.email = email;
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