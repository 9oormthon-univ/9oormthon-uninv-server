import { PageInfoDto } from '../../../../core/dto/page-info.dto';

export class IdeaOverviewDto {
  id: number;
  subject: string | null;
  title: string;
  summary: string;
  is_active: boolean;
  is_bookmarked: boolean;

  constructor(id: number, subject: string | null, title: string, summary: string, isActive: boolean, isBookmarked: boolean) {
    this.id = id;
    this.subject = subject;
    this.title = title;
    this.summary = summary;
    this.is_active = isActive;
    this.is_bookmarked = isBookmarked;
  }
}

export class ReadIdeaOverviewResponseDto {
  max_idea_number: number;
  current_idea_number: number;
  ideas: IdeaOverviewDto[];
  page_info: PageInfoDto;

  constructor(ideas: IdeaOverviewDto[], pageInfo: PageInfoDto, maxIdeaNumber: number, currentIdeaNumber: number) {
    this.max_idea_number = maxIdeaNumber;
    this.current_idea_number = currentIdeaNumber;
    this.ideas = ideas;
    this.page_info = pageInfo;
  }

  static of(ideas: IdeaOverviewDto[], pageInfo: PageInfoDto, maxIdeaNumber: number, currentIdeaNumber: number): ReadIdeaOverviewResponseDto {
    return new ReadIdeaOverviewResponseDto(ideas, pageInfo, maxIdeaNumber, currentIdeaNumber);
  }
}
