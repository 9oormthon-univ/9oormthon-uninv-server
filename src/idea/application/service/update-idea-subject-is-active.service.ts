import { UpdateIdeaSubjectIsActiveUseCase } from '../usecase/update-idea-subject-is-active.usecase';
import { IdeaSubjectRepositoryImpl } from '../../repository/idea-subject.repository.impl';
import { DataSource } from 'typeorm';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CommonException } from '../../../core/exceptions/common.exception';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateIdeaSubjectIsActiveService implements UpdateIdeaSubjectIsActiveUseCase {
  constructor(
    private readonly ideaSubjectRepository: IdeaSubjectRepositoryImpl,
    private readonly userRepository: UserRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaSubjectId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }
      if (!user.isAdmin()) {
        throw new CommonException(ErrorCode.ACCESS_DENIED);
      }

      const ideaSubject = await this.ideaSubjectRepository.findById(ideaSubjectId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }
      const updatedIdeaSubject = ideaSubject.isActiveToggle();
      await this.ideaSubjectRepository.save(updatedIdeaSubject, manager);
    });
  }
}