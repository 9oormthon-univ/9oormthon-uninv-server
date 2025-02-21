import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadUserDetailResponseDto } from '../dto/response/read-user-detail.response.dto';
import { UserRepository } from '../../repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUserDetailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute (userId: number, targetUserId: number) {

    const me = await this.userRepository.findByIdWithUniv(userId);
    if (!me) {
      throw new CommonException(ErrorCode.NOT_FOUND_USER);
    }

    const user = await this.userRepository.findByIdWithUniv(userId);
    if (!user) {
      throw new CommonException(ErrorCode.NOT_FOUND_USER);
    }
    return ReadUserDetailResponseDto.of(user, me.id === targetUserId);
  }
}
