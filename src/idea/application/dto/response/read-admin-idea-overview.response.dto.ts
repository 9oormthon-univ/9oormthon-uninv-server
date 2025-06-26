import { PageInfoDto } from '../../../../core/dto/page-info.dto';
import { ETeamStatus } from '../../../../core/enums/team-status.enum';

export class AdminIdeaOverviewDto {
  id: number;
  title: string;
  subject: string;
  provider: string;
  team_building: ETeamStatus;

  constructor(id: number, title: string, subject: string, provider: string, team_building: ETeamStatus) {
    this.id = id;
    this.title = title;
    this.subject = subject;
    this.provider = provider;
    this.team_building = team_building;
  }
}

export class ReadAdminIdeaOverviewResponseDto {
  ideas: AdminIdeaOverviewDto[];
  page_info: PageInfoDto;

  constructor(ideas: AdminIdeaOverviewDto[], pageInfo: PageInfoDto) {
    this.ideas = ideas;
    this.page_info = pageInfo;
  }

  static of(ideas: AdminIdeaOverviewDto[], pageInfo: PageInfoDto): ReadAdminIdeaOverviewResponseDto {
    return new ReadAdminIdeaOverviewResponseDto(ideas, pageInfo);
  }
}
