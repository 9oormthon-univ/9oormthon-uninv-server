import { IdeaRepositoryImpl } from '../../repository/idea.repository.impl';
import { ReadMyIdeaDetailUseCase } from '../usecase/read-my-idea-detail.usecase';
import { DataSource } from 'typeorm';
import { ReadMyIdeaDetailResponseDto } from '../dto/response/read-my-idea-detail.response.dto';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { TeamRepositoryImpl } from '../../../team/repository/team.repository.impl';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyIdeaDetailService implements ReadMyIdeaDetailUseCase {
  constructor(
    private readonly ideaRepository: IdeaRepositoryImpl,
    private readonly teamRepository: TeamRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number): Promise<ReadMyIdeaDetailResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findByIdWithUniv(userId, manager);
      if(!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const { idea, isBookmarked, isActive } = await this.ideaRepository.findMyIdeaDetail(userId, manager);
      if(!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const team = await this.teamRepository.findByIdeaWithIdeaAndMembers(idea, manager);
      if(!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      return ReadMyIdeaDetailResponseDto.of(user, idea, team, isActive, isBookmarked);
    });
  }
}