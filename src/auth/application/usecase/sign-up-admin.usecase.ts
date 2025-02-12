import { SignUpAdminRequestDto } from '../dto/request/sign-up-admin.request.dto';

export interface SignUpAdminUseCase {
  execute(requestDto: SignUpAdminRequestDto): Promise<void>;
}