import { LoginRequestDto } from '../dto/request/login.request.dto';
import { JwtTokenResponseDto } from '../dto/response/jwt-token.response.dto';

export interface LoginUseCase {
  execute(requestDto: LoginRequestDto): Promise<JwtTokenResponseDto>;
}