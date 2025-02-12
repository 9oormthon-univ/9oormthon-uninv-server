export interface IdeaOverviewDto {
  id: number;
  subject: string | null;
  title: string;
  summary: string;
  is_active: boolean;
  is_bookmarked: boolean;
}

export interface PageInfoDto {
  current_page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
}

export class ReadIdeaOverviewResponseDto {
  success: boolean;
  data: {
    ideas: IdeaOverviewDto[];
    page_info: PageInfoDto;
  };
  error: any;
}
