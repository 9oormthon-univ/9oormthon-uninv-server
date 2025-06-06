import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { MemberRepository } from '../../../team/repository/member.repository';
import { ReadAdminUserDetailResponseDto } from '../dto/response/read-admin-user-detail.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAdminUserDetailService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute (adminId: number, userId: number, generations: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      const user = await this.userRepository.findByIdWithUniv(userId, manager);
      const member = await this.memberRepository.findByUserIdAndGeneration(userId, generations, manager)
      const teamInfo = member ?
        member.team.number ?
          member.team.number.toString() + '팀 / ' + member.team.name:
          '-팀 / ' + member.team.name
        : null;
      const univInfo = {
        id: user.univ.id,
        name: user.univ.name,
      }
      return ReadAdminUserDetailResponseDto.of(
        user.name,
        user.imgUrl,
        teamInfo,
        member ? member.role : null,
        univInfo,
        user.serialId,
        user.phoneNumber,
        user.generations ? user.generations.map(Number) : []
      );
    });
  }
}