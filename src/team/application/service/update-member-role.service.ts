import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { MemberRepository } from '../../repository/member.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UpdateMemberRoleRequestDto } from '../dto/request/update-member-role.request.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateMemberRoleService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(adminId: number, memberId: number, requestDto: UpdateMemberRoleRequestDto) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 멤버 조회
      const member = await this.memberRepository.findWithTeamById(memberId);
      if (!member) {
        throw new CommonException(ErrorCode.NOT_FOUND_MEMBER);
      }

      // 요청한 역할에 잔여 인원이 있는지 검증
      member.team.validateApplyTeamCapacityLimits(requestDto.role);

      // 멤버의 역할을 업데이트
      const updatedMember = member.changeRole(requestDto.role);
      await this.memberRepository.save(updatedMember, manager);
    });
  }
}