import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { UpdateUnivRequestDto } from '../dto/request/update-univ.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UnivModel } from '../../domain/univ.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateUnivService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, univId: number, requestDto: UpdateUnivRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if(!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 대학 조회
      const univ = await this.univRepository.findById(univId, manager);
      if (!univ) {
        throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
      }

      let leader;
      if (!requestDto.leaderId) {
        leader = null;
      } else {
        // 리더 조회
        leader = await this.userRepository.findByIdWithUniv(requestDto.leaderId, manager);
        if (!leader) {
          throw new CommonException(ErrorCode.NOT_FOUND_USER);
        }

        if (leader.univ.name !== univ.name) {
          throw new CommonException(ErrorCode.UNIV_LEADER_NOT_MATCH);
        }
      }

      // 대학 정보 업데이트
      const updatedUniv = UnivModel.updateUniv(
        univ,
        requestDto.name,
        requestDto.instagramUrl,
        leader
      )
      await this.univRepository.save(updatedUniv, manager);
    });
  }
}