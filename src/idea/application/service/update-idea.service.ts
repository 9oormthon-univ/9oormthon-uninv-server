import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { DataSource } from 'typeorm';
import { MemberRepository } from '../../../team/repository/member.repository';
import { UpdateIdeaRequestDto } from '../dto/request/update-idea.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { TeamRepository } from '../../../team/repository/team.repository';
import { ApplyRepository } from '../../repository/apply.repository';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { EApplyStatus } from '../../../core/enums/apply-status.enum';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateIdeaService {
  constructor(
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number, requestDto: UpdateIdeaRequestDto) : Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 현재 phase 조회
      const currentPhase = systemSetting.getWhichPhase();

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 해당 아이디어의 제시자인지 확인
      idea.validateIsProvider(userId);

      // request 에 포함된 아이디어 주제 조회
      const ideaSubject = await this.ideaSubjectRepository.findById(requestDto.ideaInfo.ideaSubjectId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }

      // 아이디어 업데이트
      const updatedIdea = idea.updateIdeaDefaultInfo(
        requestDto.ideaInfo.title,
        requestDto.ideaInfo.summary,
        requestDto.ideaInfo.content,
        ideaSubject,
        requestDto.requirements.pm.requirement,
        requestDto.requirements.pm.requiredTechStacks,
        requestDto.requirements.pd.requirement,
        requestDto.requirements.pd.requiredTechStacks,
        requestDto.requirements.fe.requirement,
        requestDto.requirements.fe.requiredTechStacks,
        requestDto.requirements.be.requirement,
        requestDto.requirements.be.requiredTechStacks,
      )
      this.ideaRepository.save(updatedIdea, manager)

      // 팀 조회
      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);
      if(!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀의 멤버 조회
      const members = await this.memberRepository.findByIdeaId(requestDto.ideaInfo.ideaSubjectId, manager);

      // 해당 아이디어에 대한 지원 정보 조회
      const applies = await this.applyRepository.findByIdeaIdAndPhase(ideaId, currentPhase, manager);

      // 현재 멤버들로 이루어진 특정 파트의 멤버 수 + 현재 수락한 특정 파트의 지원 수 보다 더 적은 수로 파트 정원을 변경하려고 할 시 예외 처리
      if (requestDto.requirements.pm.capacity < members.filter(member => member.role === 'PM').length + applies.filter(apply => apply.role === 'PM' && apply.status === EApplyStatus.ACCEPTED).length ||
          requestDto.requirements.pd.capacity < members.filter(member => member.role === 'PD').length + applies.filter(apply => apply.role === 'PD' && apply.status === EApplyStatus.ACCEPTED).length ||
          requestDto.requirements.fe.capacity < members.filter(member => member.role === 'FE').length + applies.filter(apply => apply.role === 'FE' && apply.status === EApplyStatus.ACCEPTED).length ||
          requestDto.requirements.be.capacity < members.filter(member => member.role === 'BE').length + applies.filter(apply => apply.role === 'BE' && apply.status === EApplyStatus.ACCEPTED).length) {
        throw new CommonException(ErrorCode.TEAM_ROLE_CAPACITY_CONFLICT);
      }

      // 각 직군별 capacity 업데이트
      const updatedTeam = team.updateCapacity(
        requestDto.requirements.pm.capacity,
        requestDto.requirements.pd.capacity,
        requestDto.requirements.fe.capacity,
        requestDto.requirements.be.capacity
      )

      // 팀원 수 시스템 유효성 검증
      updatedTeam.validateSystemCapacityLimits();

      this.teamRepository.save(updatedTeam, manager);

      // 아이디어 제시자의 역할이 바뀌었다면, member 도 수정
      const member = await this.memberRepository.findByUserIdAndGeneration(userId, idea.generation, manager);
      if(!member) {
        throw new CommonException(ErrorCode.NOT_FOUND_MEMBER);
      }

      if(member.role !== requestDto.ideaInfo.providerRole) {
        // 아이디어 제시자의 역할이 바뀌었다면, member 의 role 도 업데이트
        const updatedMember = member.changeRole(requestDto.ideaInfo.providerRole);
        await this.memberRepository.save(updatedMember, manager);

        // 바꾸려는 직군에 빈 자리가 있는지 확인
        const updatedTeamWithMembers = await this.teamRepository.findByIdeaWithIdeaAndMembers(updatedIdea, manager);
        updatedTeamWithMembers.validateCreateOrUpdateTeamCapacityLimits(requestDto.ideaInfo.providerRole);
      }
    });
  }

}