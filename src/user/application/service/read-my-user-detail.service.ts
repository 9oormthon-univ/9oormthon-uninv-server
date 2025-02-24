import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadUserDetailResponseDto } from '../dto/response/read-user-detail.response.dto';
import { UserRepository } from '../../repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyUserDetailService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute (userId: number) {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findByIdWithUnivAndLinks(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }
      return ReadUserDetailResponseDto.of(user, true);
    });
  }
}
