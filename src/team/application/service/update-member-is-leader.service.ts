import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { MemberRepository } from '../../repository/member.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { TeamRepository } from '../../repository/team.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateMemberIsLeaderService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
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

      // 멤버가 속한 팀 조회
      const team = await this.teamRepository.findWithMembersById(member.team.id, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀의 현재 리더를 찾아서 리더 상태를 false로 변경. 현재 리더가 없다면 패스
      const currentLeader = team.members.find(m => m.isLeader);
      if (currentLeader) {
        const updatedCurrentLeader = currentLeader.changeIsLeader(false);
        await this.memberRepository.save(updatedCurrentLeader, manager);
      }

      // 멤버의 리더 상태를 true로 변경
      const updatedMember = member.changeIsLeader(true);
      await this.memberRepository.save(updatedMember, manager);
    });
  }
}