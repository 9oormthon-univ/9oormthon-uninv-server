import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadUserDetailResponseDto } from '../dto/response/read-user-detail.response.dto';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUserDetailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute (userId: number) {
    const user = await this.userRepository.findByIdWithUniv(userId);
    return ReadUserDetailResponseDto.from(user);
  }
}
