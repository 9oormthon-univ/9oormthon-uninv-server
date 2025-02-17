import { ReadRemainPreferenceBriefResponseDto } from '../dto/response/read-remain-preference-brief.response.dto';
import { ReadRemainPreferenceBriefRequestDto } from '../dto/request/read-remain-preference-brief.request.dto';

export interface ReadRemainPreferenceBriefUseCase {
  execute(userId: number, requestDto: ReadRemainPreferenceBriefRequestDto): Promise<ReadRemainPreferenceBriefResponseDto>;
}