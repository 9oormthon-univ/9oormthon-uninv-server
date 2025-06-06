import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { MemberRepository } from '../../repository/member.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateMemberIsLeaderService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, memberId: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 멤버 조회
      const member = await this.memberRepository.findWithTeamById(memberId, manager);
      if (!member) {
        throw new CommonException(ErrorCode.NOT_FOUND_MEMBER);
      }

      // 팀의 현재 리더를 찾아서 리더 상태를 false로 변경. 현재 리더가 없다면 패스
      const currentLeader = member.team.members.find(m => m.isLeader);
      if (currentLeader) {
        currentLeader.changeIsLeader(false);
        await this.memberRepository.save(currentLeader, manager);
      }

      // 멤버의 리더 상태를 true로 변경
      member.changeIsLeader(true);
    });
  }
}