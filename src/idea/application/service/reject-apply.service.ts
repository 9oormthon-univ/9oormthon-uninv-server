import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { IdeaRepository } from '../../repository/idea.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class RejectApplyService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, applyId: number): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 지원 정보 조회
      const apply = await this.applyRepository.findById(applyId, manager);
      if (!apply) {
        throw new CommonException(ErrorCode.NOT_FOUND_APPLY);
      }

      // 유저의 아이디어 조회
      const idea = await this.ideaRepository.findByUserIdAndGeneration(userId, apply.idea.generation, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_PROVIDER_ERROR);
      }

      // 지원 정보의 아이디어와 유저의 아이디어가 일치하는지 확인
      if (idea.id !== apply.idea.id) {
        throw new CommonException(ErrorCode.NOT_MATCH_IDEA_ERROR);
      }

      // 지원 정보의 상태를 REJECTED 로 변경
      const updatedApply = apply.reject();

      // 지원 정보 저장
      await this.applyRepository.save(updatedApply, manager);
    });
  }
}