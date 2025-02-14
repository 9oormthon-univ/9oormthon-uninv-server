import { ReadMyIdeaDetailResponseDto } from '../dto/response/read-my-idea-detail.response.dto';

export interface ReadMyIdeaDetailUseCase {
  execute(userId: number, ideaId: number): Promise<ReadMyIdeaDetailResponseDto>;
}