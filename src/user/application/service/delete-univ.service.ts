import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { UnivRepository } from '../../repository/univ.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteUnivService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, univId: number) {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      const univUsers = await this.userRepository.findAllByUnivId(univId);
      if (univUsers.length > 0) {
        throw new CommonException(ErrorCode.UNIV_HAS_USERS);
      }

      // 대학 정보 조회
      const univ = await this.univRepository.findById(univId, manager);
      if (!univ) {
        throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
      }

      // 대학 삭제
      await this.univRepository.delete(univId, manager);
    });

  }
}