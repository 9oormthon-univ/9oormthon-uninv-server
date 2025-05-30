import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadUnivBriefResponseDto } from '../dto/response/read-univ-brief.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUnivBriefService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute (userId: number, generation: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      const univs = await this.univRepository.findAllByGeneration(generation);

      const univBriefs = univs.map(univ => ({
        id: univ.id,
        name: univ.name,
      }));

      return ReadUnivBriefResponseDto.of(
        univBriefs,
        univs.length
      )
    });
  }
}