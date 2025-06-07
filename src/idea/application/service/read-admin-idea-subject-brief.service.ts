import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { ReadIdeaSubjectBriefResponseDto } from '../dto/response/read-idea-subject-brief.response.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepository } from '../../../user/repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAdminIdeaSubjectBriefService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, generation: number): Promise<ReadIdeaSubjectBriefResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if(!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 아이디어 주제 조회
      const ideaSubjects = await this.ideaSubjectRepository.findAllByGeneration(generation, manager);

      return ReadIdeaSubjectBriefResponseDto.from(ideaSubjects);
    });
  }
}