import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteAdminIdeaService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, ideaId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 아이디어 주제 조회
      const ideaSubject = await this.ideaSubjectRepository.findById(ideaId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }

      // 아이디어 주제 삭제
      await this.ideaSubjectRepository.delete(ideaId, manager);
    });
  }
}