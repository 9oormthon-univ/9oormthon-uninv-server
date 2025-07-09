import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from 'src/team/repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaRepository } from '../../../idea/repository/idea.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteTeamService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, teamId: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 팀 조회
      const team = await this.teamRepository.findWithMembersById(teamId, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }
      // 팀에 멤버가 있는지 확인
      if (team.members.length > 0) {
        throw new CommonException(ErrorCode.TEAM_HAS_MEMBERS);
      }

      // 팀 삭제
      await this.teamRepository.delete(team, manager);

      // 팀이랑 연관이 있는 아이디어가 있는지 확인. 있다면 삭제
      const idea = await this.ideaRepository.findByTeamId(teamId, manager);
      if (idea) {
        await this.ideaRepository.delete(idea.id);
      }
    });
  }
}