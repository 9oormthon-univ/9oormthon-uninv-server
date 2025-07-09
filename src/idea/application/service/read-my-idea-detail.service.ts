import { IdeaRepository } from '../../repository/idea.repository';
import { DataSource } from 'typeorm';
import { ReadMyIdeaDetailResponseDto } from '../dto/response/read-my-idea-detail.response.dto';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from '../../../team/repository/team.repository';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { ApplyRepository } from '../../repository/apply.repository';
import { EPeriod } from '../../../core/enums/period.enum';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyIdeaDetailService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly systemSettingRepository: SystemSettingRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number): Promise<ReadMyIdeaDetailResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 시스템 설정 조회
      const systemSetting = await this.systemSettingRepository.findFirst(manager);
      if (!systemSetting) {
        throw new CommonException(ErrorCode.NOT_FOUND_SYSTEM_SETTING);
      }

      // 유저 조회
      const user = await this.userRepository.findByIdWithUniv(userId, manager);
      if(!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 아이디어 조회
      const { idea, isBookmarked, isActive } = await this.ideaRepository.findMyIdeaDetail(userId, manager);
      if(!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 팀 조회
      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);
      if(!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀빌딩 기간이라면 지원정보 표시
      if (!(systemSetting.getWhichPeriod() === EPeriod.IDEA_SUBMISSION || systemSetting.getWhichPeriod() === EPeriod.NONE || systemSetting.getWhichPeriod() === EPeriod.HACKATHON)) {
        const apply = await this.applyRepository.findByTeamIdAndGenerationAndPhase(team.id, team.generation, EPeriod.fromPeriod(systemSetting.getWhichPeriod()), manager);

        return ReadMyIdeaDetailResponseDto.of(user, idea, team, isActive, isBookmarked, apply);
      }

      // 팀빌딩 기간이 아니라면 지원정보 표시하지 않음
      return ReadMyIdeaDetailResponseDto.of(user, idea, team, isActive, isBookmarked, null);
    });
  }
}