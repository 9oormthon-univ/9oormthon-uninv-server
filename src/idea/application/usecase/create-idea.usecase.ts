import { CreateIdeaRequestDto } from '../dto/request/create-idea.request.dto';

export interface CreateIdeaUseCase {
  execute(userId:number, requestDto: CreateIdeaRequestDto): Promise<void>;
}