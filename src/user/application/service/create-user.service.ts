import { Injectable, UseFilters } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CreateUserRequestDto } from '../dto/request/create-user.request.dto';
import { UserModel } from '../../domain/user.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, requestDto: CreateUserRequestDto) {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 대학 정보 조회
      const univ = await this.univRepository.findById(requestDto.univId, manager);
      if (!univ) {
        throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
      }

      // 이미 존재하는 이메일인지 확인
      const existingUser = await this.userRepository.findBySerialId(requestDto.email, manager);
      if (existingUser) {
        throw new CommonException(ErrorCode.ALREADY_EXISTS_USER);
      }

      // 사용자 생성
      const user = UserModel.createUser(
        requestDto.email,
        await bcrypt.hash(requestDto.phoneNumber, 10),
        process.env.USER_DEFAULT_PROFILE_IMG_URL,
        requestDto.name,
        requestDto.phoneNumber,
        requestDto.generations
          .slice()
          .sort((a, b) => a - b)
          .map(String),
        univ
      )
      await this.userRepository.save(user, manager);
    });
  }
}