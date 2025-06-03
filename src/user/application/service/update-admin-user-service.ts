import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UpdateAdminUserRequestDto } from '../dto/request/update-admin-user.request.dto';
import { UnivRepository } from '../../repository/univ.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateAdminUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, userId: number, requestDto: UpdateAdminUserRequestDto) {
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

      const univ = await this.univRepository.findById(requestDto.univ_id, manager);
      if (!univ) {
        throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
      }

      if (user.serialId !== requestDto.email) {
        // 이메일이 변경된 경우, 중복 검사
        const existingUser = await this.userRepository.findBySerialId(requestDto.email, manager);
        if (existingUser) {
          throw new CommonException(ErrorCode.ALREADY_EXISTS_USER);
        }
      }

      // 유저 정보 업데이트
      const updatedUser = user.updateUserByAdmin(
        requestDto.name,
        univ,
        requestDto.email,
        requestDto.phone_number,
        requestDto.generation.map(String)
      );
      await this.userRepository.save(updatedUser, manager);
    });
  }
}