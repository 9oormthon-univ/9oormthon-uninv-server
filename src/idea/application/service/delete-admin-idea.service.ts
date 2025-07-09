import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaRepository } from '../../repository/idea.repository';
import { MemberRepository } from '../../../team/repository/member.repository';
import { ApplyRepository } from '../../repository/apply.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class DeleteAdminIdeaService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly memberRepository: MemberRepository,
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

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 팀에 팀장을 제외한 멤버가 있는지 확인
      const members = await this.memberRepository.findByIdeaId(idea.id, manager);
      if ((members ?? []).length > 1) {
        throw new CommonException(ErrorCode.ALREADY_ANOTHER_MEMBER_IN_TEAM);
      }

      // 해당 아이디어에 대한 지원을 모두 삭제
      await this.applyRepository.deleteByIdeaId(ideaId, manager);

      // 아이디어 삭제
      await this.ideaRepository.delete(ideaId, manager);
    });
  }
}