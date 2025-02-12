import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadUserDetailResponseDto } from '../dto/response/read-user-detail.response.dto';
import { ReadUserDetailUseCase } from '../usecase/read-user-detail.usecase';
import { UserRepositoryImpl } from '../../repository/user.repository.impl';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUserDetailService implements ReadUserDetailUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute (userId: number) {
    const user = await this.userRepository.findByIdWithUniv(userId);
    return ReadUserDetailResponseDto.from(user);
  }
}
