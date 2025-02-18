import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { CreateIdeaSubjectRequestDto } from '../dto/request/create-idea-subject.request.dto';
import { IdeaSubjectModel } from '../../domain/idea-subject.model';
import { UserRepository } from '../../../user/repository/user.repository';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { CommonException } from '../../../core/exceptions/common.exception';
import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateIdeaSubjectService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto: CreateIdeaSubjectRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 유저 조회
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 관리자 권한 확인
      user.validateAdminRole();

      const ideaSubject = IdeaSubjectModel.createIdeaSubject(requestDto.name);

      await this.ideaSubjectRepository.save(ideaSubject, manager);
    });
  }
}