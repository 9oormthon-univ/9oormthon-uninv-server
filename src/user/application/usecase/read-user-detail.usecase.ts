import { ReadUserDetailResponseDto } from '../dto/response/read-user-detail.response.dto';

export interface ReadUserDetailUseCase {
  execute(userId:number): Promise<ReadUserDetailResponseDto>;
}