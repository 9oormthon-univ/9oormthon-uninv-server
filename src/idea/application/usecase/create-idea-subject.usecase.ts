import { CreateIdeaSubjectRequestDto } from '../dto/request/create-idea-subject.request.dto';

export interface CreateIdeaSubjectUseCase {
  execute(userId: number, requestDto: CreateIdeaSubjectRequestDto): Promise<void>;
}