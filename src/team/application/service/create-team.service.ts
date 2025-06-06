import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CreateTeamRequestDto } from '../dto/request/create-team.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { TeamModel } from '../../domain/team.model';
import { ETeamStatus } from '../../../core/enums/team-status.enum';
import { ProjectRepository } from '../../repository/project.repository';
import { ProjectModel } from '../../domain/project.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateTeamService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, requestDto: CreateTeamRequestDto) {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if(!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 팀 생성
      const team = TeamModel.createTeam(
        requestDto.name,
        0,
        requestDto.generation,
        requestDto.pmCapacity,
        requestDto.pdCapacity,
        requestDto.feCapacity,
        requestDto.beCapacity,
        ETeamStatus.RECRUITING,
        null,
        null
      )

      team.validateSystemCapacityLimits();

      const createdTeam = await this.teamRepository.saveAndReturnSkipIdeaTrue(team, manager);

      // 프로젝트 생성
      const project = ProjectModel.createProject(
        "프로젝트 명",
        "내용",
        team.generation,
        null,
        null,
        null,
        null,
        null,
        createdTeam
      );
      await this.projectRepository.save(project, manager);
    });
  }
}