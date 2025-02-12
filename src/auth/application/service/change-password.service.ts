import { Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UpdatePasswordRequestDto } from '../dto/request/update-password.request.dto';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { ChangePasswordUseCase } from '../usecase/change-password.usecase';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ChangePasswordService implements ChangePasswordUseCase{
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(
    userId: number,
    changePasswordDto: UpdatePasswordRequestDto,
  ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findByIdWithUniv(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const isPasswordValid = await bcrypt.compare(
        changePasswordDto.currentPassword,
        user.password,
      );

      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_CHANGE_PASSWORD);
      }

      const updatedUser = user.updatePassword(await bcrypt.hash(changePasswordDto.newPassword, 10));
      await this.userRepository.save(updatedUser);
    });
  }
}
