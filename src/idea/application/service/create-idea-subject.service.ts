import { CreateIdeaSubjectUseCase } from '../usecase/create-idea-subject.usecase';
import { IdeaSubjectRepositoryImpl } from '../../repository/idea-subject.repository.impl';
import { DataSource } from 'typeorm';
import { CreateIdeaSubjectRequestDto } from '../dto/request/create-idea-subject.request.dto';
import { IdeaSubjectModel } from '../../domain/idea-subject.model';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CommonException } from '../../../core/exceptions/common.exception';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateIdeaSubjectService implements CreateIdeaSubjectUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly ideaSubjectRepository: IdeaSubjectRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto: CreateIdeaSubjectRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }
      if (!user.isAdmin()) {
        throw new CommonException(ErrorCode.ACCESS_DENIED);
      }
      const ideaSubject = IdeaSubjectModel.createIdeaSubject(requestDto.name);

      await this.ideaSubjectRepository.save(ideaSubject, manager);
    });
  }
}