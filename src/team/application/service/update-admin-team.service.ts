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
import { ProjectModel } from '../../domain/project.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateAdminTeamService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly dataSource: DataSource
  ) {}

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

      team.updateByAdmin(
        requestDto.teamName,
        requestDto.number,
        requestDto.pmCapacity,
        requestDto.pdCapacity,
        requestDto.feCapacity,
        requestDto.beCapacity
      );
      // 팀원 직군 유효성 검증
      team.validateSystemCapacityLimits();
      await this.teamRepository.save(team, manager);

      const leader = team.members.filter(
        (member) => member.isLeader
      )[0];
      // 팀 리더 변경
      if (leader !== null && leader !== undefined && leader.user.id != requestDto.leaderId) {
        leader.changeIsLeader(false);
        const newLeader = team.members.filter(
          (member) => member.user.id === requestDto.leaderId
        )[0];
        if (!newLeader) {
          throw new CommonException(ErrorCode.NOT_FOUND_USER);
        }
        newLeader.changeIsLeader(true);
        await this.memberRepository.save(newLeader, manager);
      } else if (leader === null || leader === undefined) { // 리더가 없었던 경우
        const newLeader = team.members.filter(
          (member) => member.user.id === requestDto.leaderId
        )[0];
        if (!newLeader) {
          throw new CommonException(ErrorCode.NOT_FOUND_USER);
        }
        newLeader.changeIsLeader(true);
        await this.memberRepository.save(newLeader, manager);
      }

      // 프로젝트 조회
      const project = await this.projectRepository.findByTeamId(teamId, manager);
      if (!project && requestDto.serviceName !== null && requestDto.serviceName !== undefined && requestDto.serviceName !== '') {
        const newProject = ProjectModel.createProject(
          requestDto.serviceName,
          "내용",
          team.generation,
          null,
          null,
          null,
          null,
          null,
          team
        );
        await this.projectRepository.save(newProject, manager);
      } else {
        project.updateName(requestDto.serviceName)
        await this.projectRepository.save(project, manager);
      }
    });
  }
}