import { PageInfoDto } from '../../../../core/dto/page-info.dto';
import { ETeamStatus } from '../../../../core/enums/team-status.enum';

export class TeamOverviewDto {
  id : number;
  number: number;
  name: string;
  service_name: string;
  member_count: number;
  team_building: ETeamStatus;

  constructor(
    id: number,
    number: number,
    name: string,
    service_name: string,
    member_count: number,
    team_building: ETeamStatus
  ) {
    this.id = id;
    this.number = number;
    this.name = name;
    this.service_name = service_name;
    this.member_count = member_count;
    this.team_building = team_building;
  }
}

export class ReadTeamOverviewResponseDto {
  teams: TeamOverviewDto[];
  page_info: PageInfoDto;

  constructor(
    teams: TeamOverviewDto[],
    page_info: PageInfoDto
  ) {
    this.teams = teams;
    this.page_info = page_info;
  }

  static of(
    teams: TeamOverviewDto[],
    pageInfo: PageInfoDto
  ): ReadTeamOverviewResponseDto {
    return new ReadTeamOverviewResponseDto(teams, pageInfo);
  }

}