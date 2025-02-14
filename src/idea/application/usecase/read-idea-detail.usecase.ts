import { ReadIdeaDetailResponseDto } from '../dto/response/read-idea-detail.response.dto';

export interface ReadIdeaDetailUseCase {
  execute(userId: number, ideaId: number): Promise<ReadIdeaDetailResponseDto>;
}