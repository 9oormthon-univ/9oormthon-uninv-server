import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadUserBriefResponseDto } from '../dto/response/read-user-brief.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUserBriefService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, univId: number, search: string, generation: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 모든 유저 조회
      const users = await this.userRepository.findAllByUnivIdAndSearchAndGeneration(univId, search, generation, manager);
      const userInfos = users.map(
        (user) => ({
          id: user.id,
          description: `${user.name}/${user.univ.name}/${user.phoneNumber}`,
        })
      )
      return ReadUserBriefResponseDto.of(userInfos);
    });
  }
}