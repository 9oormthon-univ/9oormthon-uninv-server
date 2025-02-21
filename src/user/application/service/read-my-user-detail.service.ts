import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadMyUserDetailResponseDto } from '../dto/response/read-my-user-detail.response.dto';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyUserDetailService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute (userId: number) {
    const user = await this.userRepository.findByIdWithUniv(userId);
    return ReadMyUserDetailResponseDto.from(user);
  }
}
