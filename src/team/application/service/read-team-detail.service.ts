import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { TeamRepository } from '../../repository/team.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ReadTeamDetailResponseDto } from '../dto/response/read-team-detail.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadTeamDetailService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, generation: number): Promise<ReadTeamDetailResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      const team = await this.teamRepository.findByUserIdAndGeneration(userId, generation, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }
      return ReadTeamDetailResponseDto.from(team);
    });
  }
}