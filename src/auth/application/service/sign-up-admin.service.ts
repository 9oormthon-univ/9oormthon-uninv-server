import { Injectable, UseFilters } from '@nestjs/common';
import { SignUpAdminRequestDto } from '../dto/request/sign-up-admin.request.dto';
import * as bcrypt from 'bcryptjs';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repository/user.repository';
import { UserModel } from '../../../user/domain/user.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class SignUpAdminService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(authSignUpDto: SignUpAdminRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 코드가 일치하지 않을 경우 예외 발생
      if (authSignUpDto.adminAuthCode !== process.env.ADMIN_AUTH_CODE) {
        throw new CommonException(ErrorCode.INVALID_ADMIN_AUTH_CODE_ERROR);
      }

      // 이미 존재하는 아이디라면 예외 발생
      const user = await this.userRepository.findBySerialId(authSignUpDto.serialId, manager);
      if (user) {
        throw new CommonException(ErrorCode.ALREADY_EXISTS_USER);
      }

      // 어드민 계정 생성
      const newUser = UserModel.createAdmin(
        authSignUpDto.serialId,
        await bcrypt.hash(authSignUpDto.password, 10),
      )

      await this.userRepository.save(newUser);
    });
  }
}
