import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadUnivDetailResponseDto } from '../dto/response/read-univ-detail.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadUnivDetailService {
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

      // 대학 정보 조회
      const univ = await this.univRepository.findByIdWithLeader(univId, manager);
      if (!univ) {
        throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
      }

      let leader;

      if (!univ.leader) {
        leader = null;
      } else {
        leader = {
          id: univ.leader.id,
          description: univ.leader.name + '/' + univ.name + '/' + univ.leader.phoneNumber
        }
      }
      return ReadUnivDetailResponseDto.of(
        univ.id,
        univ.name,
        univ.instagramUrl,
        univ.generation,
        leader
      )
    });
  }
}