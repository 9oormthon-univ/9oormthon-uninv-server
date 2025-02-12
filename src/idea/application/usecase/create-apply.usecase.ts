import { CreateApplyRequestDto } from '../dto/request/create-apply.request.dto';

export interface CreateApplyUseCase {
  execute(userId: number, ideaId: number, requestDto: CreateApplyRequestDto): Promise<void>;
}