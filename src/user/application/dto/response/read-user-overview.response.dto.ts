import { PageInfoDto } from '../../../../core/dto/page-info.dto';
import { ESecurityRole } from '../../../../core/enums/security-role.enum';

export class UserOverviewDto {
  id: number;
  role: ESecurityRole;
  name: string;
  email: string;
  team_building: boolean;
  generations: string;

  constructor(
    id: number,
    role: ESecurityRole,
    name: string,
    email: string,
    team_building: boolean,
    generations: string
  ) {
    this.id = id;
    this.role = role;
    this.name = name;
    this.email = email;
    this.team_building = team_building;
    this.generations = generations;
  }
}

export class ReadUserOverviewResponseDto {
  users: UserOverviewDto[];
  page_info: PageInfoDto;

  constructor(
    users: UserOverviewDto[],
    pageInfo: PageInfoDto
  ) {
    this.users = users;
    this.page_info = pageInfo;
  }

  static of(
    users: UserOverviewDto[],
    pageInfo: PageInfoDto
  ): ReadUserOverviewResponseDto {
    return new ReadUserOverviewResponseDto(users, pageInfo);
  }
}