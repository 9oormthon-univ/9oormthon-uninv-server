import { ReadIdeaSubjectBriefResponseDto } from '../dto/response/read-idea-subject-brief.response.dto';

export interface ReadIdeaSubjectBriefUseCase {
  execute(): Promise<ReadIdeaSubjectBriefResponseDto>;
}