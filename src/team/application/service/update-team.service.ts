import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UpdateTeamRequestDto } from '../dto/request/update-team.request.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateTeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number,requestDto: UpdateTeamRequestDto ): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 팀 조회
      const team = await this.teamRepository.findByUserIdAndGeneration(userId, requestDto.generation, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 팀장 여부 확인
      team.idea.validateIsProvider(userId);

      const updatedTeam = team.updateName(requestDto.name)
      await this.teamRepository.save(updatedTeam, manager);
    });
  }
}