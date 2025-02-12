import { ReadAuthBriefResponseDto } from '../dto/response/read-auth-brief.response.dto';

export interface ReadAuthBriefUsecase {
  execute(accessToken: string): Promise<ReadAuthBriefResponseDto>;
}