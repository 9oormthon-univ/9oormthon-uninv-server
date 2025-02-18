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

      const systemSetting = await this.systemSettingRepository.findFirst(manager);

      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 아이디어 지원 기간 확인
      systemSetting.validateIdeaApplyPeriod(requestDto.phase);

      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }
      // 이미 팀에 속해있는지 확인
      if (await this.memberRepository.findByUserIdAndGeneration(userId, idea.generation, manager)) {
        throw new CommonException(ErrorCode.ALREADY_HAVE_TEAM_ERROR);
      }

      // 이미 지원한 아이디어인지 확인
      if (await this.applyRepository.findByUserIdAndIdeaId(userId, ideaId, manager)) {
        throw new CommonException(ErrorCode.ALREADY_APPLIED_IDEA_ERROR);
      }

      // 지원이 마감된 파트인지 확인
      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);

      // 지원이 마감된 파트에 대한 지원인지 확인
      switch (requestDto.role) {
        case 'PM':
          if (team.pmCapacity <= team.members.map(member => member.role).filter(role => role === 'PM').length) {
            throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
          }
          break;
        case 'PD':
          if (team.pdCapacity <= team.members.map(member => member.role).filter(role => role === 'PD').length) {
            throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
          }
          break;
        case 'FE':
          if (team.feCapacity <= team.members.map(member => member.role).filter(role => role === 'FE').length) {
            throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
          }
          break;
        case 'BE':
          if (team.beCapacity <= team.members.map(member => member.role).filter(role => role === 'BE').length) {
            throw new CommonException(ErrorCode.CLOSED_APPLY_ERROR);
          }
          break;
        default:
          throw new CommonException(ErrorCode.INVALID_ROLE);
      }

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