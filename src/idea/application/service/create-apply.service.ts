import { CreateApplyUseCase } from '../usecase/create-apply.usecase';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { DataSource } from 'typeorm';
import { ApplyRepositoryImpl } from '../../repository/apply.repository.impl';
import { IdeaRepositoryImpl } from '../../repository/idea.repository.impl';
import { Injectable, Logger, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CreateApplyRequestDto } from '../dto/request/create-apply.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { ApplyModel } from '../../domain/apply.model';
import { MemberRepositoryImpl } from '../../../team/repository/member.repository.impl';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateApplyService implements CreateApplyUseCase {
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly ideaRepository: IdeaRepositoryImpl,
    private readonly applyRepository: ApplyRepositoryImpl,
    private readonly memberRepository: MemberRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number, requestDto: CreateApplyRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }
      // 이미 팀에 속해있는지 확인
      if (await this.memberRepository.findByUserIdAndGeneration(userId, idea.generation, manager)) {
        throw new CommonException(ErrorCode.ALREADY_HAVE_TEAM);
      }

      const apply = ApplyModel.createApply(
        requestDto.phase,
        requestDto.preference,
        requestDto.motivation,
        requestDto.role,
        user,
        idea
      )
      await this.applyRepository.save(apply, manager);
    });
  }
}