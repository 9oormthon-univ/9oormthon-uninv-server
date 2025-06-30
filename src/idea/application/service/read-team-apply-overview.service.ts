import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { TeamRepository } from '../../../team/repository/team.repository';
import { ReadTeamApplyOverviewResponseDto } from '../dto/response/read-team-apply-overview.response.dto';
import { ApplyRepository } from '../../repository/apply.repository';
import { IdeaRepository } from '../../repository/idea.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadTeamApplyOverviewService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, generation: number, phase: number, sorting: string, sortType: string): Promise<ReadTeamApplyOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 아이디어 조회
      const idea = await this.ideaRepository.findByUserIdAndGeneration(userId, generation, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_PROVIDER_ERROR);
      }

      // 유저의 팀 조회
      const team = await this.teamRepository.findByUserIdAndGeneration(userId, generation, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀의 지원 정보 조회
      const applies = await this.applyRepository.findByTeamIdAndGenerationAndPhaseSort(team.id, generation, phase, sorting, sortType, manager);

      return ReadTeamApplyOverviewResponseDto.from(applies);
    });
  }
}