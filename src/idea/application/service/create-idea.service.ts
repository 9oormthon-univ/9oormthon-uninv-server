import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../../../user/repository/user.repository';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { CreateIdeaRequestDto } from '../dto/request/create-idea.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaRepository } from '../../repository/idea.repository';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { IdeaModel } from '../../domain/idea.model';
import { TeamRepository } from '../../../team/repository/team.repository';
import { TeamModel } from '../../../team/domain/team.model';
import { MemberRepository } from '../../../team/repository/member.repository';
import { MemberModel } from '../../../team/domain/member.model';
import { ETeamStatus } from '../../../core/enums/team-status.enum';
import { ProjectRepository } from '../../../team/repository/project.repository';
import { ProjectModel } from '../../../team/domain/project.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateIdeaService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly teamRepository: TeamRepository,
    private readonly memberRepository: MemberRepository,
    private readonly projectRepository: ProjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId:number, requestDto: CreateIdeaRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 유저 조회
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 아이디어 주제 조회
      const ideaSubject = await this.ideaSubjectRepository.findById(requestDto.ideaInfo.ideaSubjectId, manager);
      if(!ideaSubject){
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }

      // 사용자가 이미 해당 기수에 아이디어를 제출했는지 확인
      const existedIdea = await this.ideaRepository.findByUserIdAndGeneration(userId, requestDto.ideaInfo.generation, manager);
      if (existedIdea) {
        throw new CommonException(ErrorCode.ALREADY_SUBMITTED_IDEA);
      }

      // 사용자가 이미 팀에 속해있는지 확인
      const existedTeam = await this.memberRepository.findByUserIdAndGeneration(userId, requestDto.ideaInfo.generation, manager);
      if (existedTeam) {
        throw new CommonException(ErrorCode.ALREADY_HAVE_TEAM_ERROR);
      }

      // 아이디어 생성
      const idea = IdeaModel.createIdea(
        requestDto.ideaInfo.title,
        requestDto.ideaInfo.summary,
        requestDto.ideaInfo.content,
        requestDto.ideaInfo.generation,
        requestDto.requirements.pm.requirement,
        requestDto.requirements.pm.requiredTechStacks,
        requestDto.requirements.pd.requirement,
        requestDto.requirements.pd.requiredTechStacks,
        requestDto.requirements.fe.requirement,
        requestDto.requirements.fe.requiredTechStacks,
        requestDto.requirements.be.requirement,
        requestDto.requirements.be.requiredTechStacks,
        user,
        ideaSubject
      )
      const createdIdea = await this.ideaRepository.save(idea, manager);

      // 팀 생성
      const team = TeamModel.createTeam(
        '팀 이름',
        0,
        idea.generation,
        requestDto.requirements.pm.capacity,
        requestDto.requirements.pd.capacity,
        requestDto.requirements.fe.capacity,
        requestDto.requirements.be.capacity,
        ETeamStatus.RECRUITING,
        createdIdea,
        null
      );

      // 팀원 수 시스템 유효성 검증
      team.validateSystemCapacityLimits();

      const createdTeam = await this.teamRepository.saveAndReturn(team, manager);

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

      // Member 생성
      const member = MemberModel.createMember(
        requestDto.ideaInfo.providerRole,
        true,
        user,
        createdTeam
      );

      await this.memberRepository.save(member, manager);

      // 아이디어 제시자가 팀에 들어갔을 때의 팀원 수 유효성 검증
      const teamWithMembers = await this.teamRepository.findWithMembersById(createdTeam.id, manager);
      teamWithMembers.validateCreateOrUpdateTeamCapacityLimits(requestDto.ideaInfo.providerRole);
    });
  }
}
