import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CommonException } from '../../../core/exceptions/common.exception';
import { UserRepository } from '../../../user/repository/user.repository';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateIdeaSubjectIsActiveService {
  constructor(
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaSubjectId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }
      if (!user.isAdmin()) {
        throw new CommonException(ErrorCode.ACCESS_DENIED);
      }

      const ideaSubject = await this.ideaSubjectRepository.findById(ideaSubjectId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }
      const updatedIdeaSubject = ideaSubject.isActiveToggle();
      await this.ideaSubjectRepository.save(updatedIdeaSubject, manager);
    });
  }
}