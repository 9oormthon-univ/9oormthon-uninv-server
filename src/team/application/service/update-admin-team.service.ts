import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { MemberRepository } from '../../repository/member.repository';
import { UpdateAdminTeamRequestDto } from '../dto/request/update-admin-team.request.dto';
import { ProjectRepository } from '../../repository/project.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateAdminTeamService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(adminId: number, teamId: number, requestDto: UpdateAdminTeamRequestDto) {
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

      const updatedTeam = team.updateByAdmin(
        requestDto.teamName,
        requestDto.number,
        requestDto.pmCapacity,
        requestDto.pdCapacity,
        requestDto.feCapacity,
        requestDto.beCapacity,
        requestDto.status
      );
      // 팀원 직군 유효성 검증
      updatedTeam.validateSystemCapacityLimits();
      await this.teamRepository.save(updatedTeam, manager);

      const leader = team.members.filter(
        (member) => member.isLeader,
      )[0];

      // 팀 리더 변경
      if (requestDto.leaderId != 0) { // 리더가 0으로 오는 경우, 리더가 없는 것. 이 경우 제외
        // 현재 리더가 있다면 현재 리더를 false로 변경 후 새로운 리더 true로 변경
        if (leader !== null && leader !== undefined && leader.user.id != requestDto.leaderId) {
          const oldLeader = leader.changeIsLeader(false);
          await this.memberRepository.save(oldLeader, manager);

          const newLeader = team.members.filter(
            (member) => member.user.id === requestDto.leaderId,
          )[0];
          if (!newLeader) {
            throw new CommonException(ErrorCode.NOT_FOUND_USER);
          }
          const updatedNewLeader = newLeader.changeIsLeader(true);
          await this.memberRepository.save(updatedNewLeader, manager);

        } else if (leader === null || leader === undefined) { // 현재 리더가 없다면 새로운 리더만 true로 변경
          const newLeader = team.members.filter(
            (member) => member.user.id === requestDto.leaderId,
          )[0];
          if (!newLeader) {
            throw new CommonException(ErrorCode.NOT_FOUND_USER);
          }
          const updatedNewLeader = newLeader.changeIsLeader(true);
          await this.memberRepository.save(updatedNewLeader, manager);
        }
      }

      // 프로젝트 조회
      const project = await this.projectRepository.findByTeamId(teamId, manager);
      if (!project) {
        throw new CommonException(ErrorCode.NOT_FOUND_PROJECT);
      }
      const updatedProject = project.updateName(requestDto.serviceName);
      await this.projectRepository.save(updatedProject, manager);
    });
  }
}