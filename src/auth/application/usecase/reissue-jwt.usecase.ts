import { JwtTokenResponseDto } from '../dto/response/jwt-token.response.dto';

export interface ReissueJwtUseCase {
  execute(refreshToken?: string): Promise<JwtTokenResponseDto>;
}