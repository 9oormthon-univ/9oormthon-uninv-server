import { Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UpdateAdminUserResponseDto } from '../dto/response/update-admin-user.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateAdminUserPasswordService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, userId: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 유저 조회
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 랜덤한 비밀번호 8자 생성
      const randomPassword = Math.random().toString(36).slice(-8);

      // 유저 비밀번호 초기화
      const updatedUser = user.resetPassword(await bcrypt.hash(randomPassword, 10));

      await this.userRepository.save(updatedUser, manager);

      return UpdateAdminUserResponseDto.of(randomPassword);
    });
  }
}