import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UpdateIdeaSubjectRequestDto } from '../dto/request/update-idea-subject.request.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateIdeaSubjectService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(adminId: number, ideaSubjectId: number, requestDto: UpdateIdeaSubjectRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 아이디어 주제 조회
      const ideaSubject = await this.ideaSubjectRepository.findById(ideaSubjectId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }

      const updatedIdeaSubject = ideaSubject.updateName(requestDto.name);
      await this.ideaSubjectRepository.save(updatedIdeaSubject, manager);
    });
  }
}
