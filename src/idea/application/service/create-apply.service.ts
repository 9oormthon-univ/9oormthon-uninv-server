import { UserRepository } from '../../../user/repository/user.repository';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { IdeaRepository } from '../../repository/idea.repository';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CreateApplyRequestDto } from '../dto/request/create-apply.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ApplyModel } from '../../domain/apply.model';
import { MemberRepository } from '../../../team/repository/member.repository';
import { TeamRepository } from '../../../team/repository/team.repository';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateApplyService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly memberRepository: MemberRepository,
    private readonly teamRepository: TeamRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number, requestDto: CreateApplyRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 아이디어 지원 기간 확인
      systemSetting.validateIdeaApplyPeriod(requestDto.phase);

      // 유저 조회
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 사용자가 이미 팀에 속해있는지 확인
      const existedTeam = await this.memberRepository.findByUserIdAndGeneration(userId, idea.generation, manager);
      if (existedTeam) {
        throw new CommonException(ErrorCode.ALREADY_HAVE_TEAM_ERROR);
      }

      // 사용자가 이미 지원한 아이디어인지 확인
      const existedApply = await this.applyRepository.findByUserIdAndIdeaId(userId, ideaId, manager);
      if (existedApply) {
        throw new CommonException(ErrorCode.ALREADY_APPLIED_IDEA_ERROR);
      }

      // 지원이 마감된 파트인지 확인
      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);

      // 지원이 마감된 파트에 대한 지원인지 확인
      team.validateTeamCapacityLimits(requestDto.role);

      const apply = ApplyModel.createApply(
        requestDto.phase,
        requestDto.preference,
        requestDto.motivation,
        requestDto.role,
        user,
        idea
      )
      await this.applyRepository.save(apply, manager);
    });
  }
}