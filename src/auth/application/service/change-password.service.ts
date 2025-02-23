import { Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordRequestDto } from '../dto/request/update-password.request.dto';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ChangePasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(
    userId: number,
    changePasswordDto: UpdatePasswordRequestDto,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 유저 조회
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_CHANGE_PASSWORD_ERROR);
      }

      // 비밀번호 변경
      const updatedUser = user.updatePassword(await bcrypt.hash(changePasswordDto.newPassword, 10));

      await this.userRepository.save(updatedUser);
    });
  }
}
