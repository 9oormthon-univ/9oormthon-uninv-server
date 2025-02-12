import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';

export interface ReadIdeaOverviewUsecase {
  /**
   * @param page 페이지 번호 (1부터 시작)
   * @param size 페이지 사이즈
   * @param generation 필수 – 아이디어의 기수
   * @param subjectId (옵션) 아이디어 주제 필터: 제공되면 해당 주제만
   * @param isActive (옵션) 모집 여부 필터: true=모집중, false=모집완료
   * @param isBookmarked (옵션) 찜 여부 필터: true이면 내 찜만 조회
   * @param userId 현재 사용자 아이디 (내 찜 여부 산출 및 isBookmarked 필터에 사용)
   */
  execute(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    userId: number
  ): Promise<ReadIdeaOverviewResponseDto>;
}
