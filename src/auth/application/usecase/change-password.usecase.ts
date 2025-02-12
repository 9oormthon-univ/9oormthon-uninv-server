import { UpdatePasswordRequestDto } from '../dto/request/update-password.request.dto';

export interface ChangePasswordUseCase {
  execute(userId: number, changePasswordDto: UpdatePasswordRequestDto,): Promise<void>;
}