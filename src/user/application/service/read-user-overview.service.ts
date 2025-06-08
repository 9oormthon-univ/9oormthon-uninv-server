import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { PageInfoDto } from '../../../core/dto/page-info.dto';
import { ReadUserOverviewResponseDto } from '../dto/response/read-user-overview.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUserOverviewService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(page: number, size: number, userId: number, generation: number, univId: number, sorting: string, sortType: string, search: string) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 모든 유저 조회
      const { users, totalItems } = await this.userRepository.findUserOverview(page, size, generation, univId, sorting, sortType, search, manager);

      const totalPages = Math.ceil(totalItems / size);

      const pageInfoDto = PageInfoDto.of(page, size, totalPages, totalItems);

      return ReadUserOverviewResponseDto.of(users, pageInfoDto);
    });
  }
}