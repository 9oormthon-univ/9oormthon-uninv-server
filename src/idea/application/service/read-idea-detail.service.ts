import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { TeamRepository } from '../../../team/repository/team.repository';
import { UserRepository } from '../../../user/repository/user.repository';
import { DataSource } from 'typeorm';
import { ReadIdeaDetailResponseDto } from '../dto/response/read-idea-detail.response.dto';
import { ReadMyIdeaDetailResponseDto } from '../dto/response/read-my-idea-detail.response.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadIdeaDetailService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly teamRepository: TeamRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number): Promise<ReadIdeaDetailResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findByIdWithUniv(userId, manager);
      if(!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const { idea, isBookmarked, isActive } = await this.ideaRepository.findIdeaDetail(ideaId, userId, manager);
      if(!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);
      if(!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      return ReadMyIdeaDetailResponseDto.of(user, idea, team, isActive, isBookmarked);
    });
  }
}