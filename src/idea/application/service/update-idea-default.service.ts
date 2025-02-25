import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { IdeaRepository } from '../../repository/idea.repository';
import { DataSource } from 'typeorm';
import { MemberRepository } from '../../../team/repository/member.repository';
import { UpdateIdeaDefaultRequestDto } from '../dto/request/update-idea-default.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaSubjectRepository } from '../../repository/idea-subject.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateIdeaDefaultService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly ideaSubjectRepository: IdeaSubjectRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, ideaId: number, requestDto: UpdateIdeaDefaultRequestDto) : Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      // 아이디어 조회
      const idea = await this.ideaRepository.findById(ideaId, manager);
      if (!idea) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA);
      }

      // 해당 아이디어의 제시자인지 확인
      idea.validateIsProvider(userId);

      // request 에 포함된 아이디어 주제 조회
      const ideaSubject = await this.ideaSubjectRepository.findById(requestDto.ideaSubjectId, manager);
      if (!ideaSubject) {
        throw new CommonException(ErrorCode.NOT_FOUND_IDEA_SUBJECT);
      }

      // 아이디어 업데이트
      const updatedIdea = idea.updateIdeaDefaultInfo(
        requestDto.title,
        requestDto.summary,
        requestDto.content,
        ideaSubject
      )
      this.ideaRepository.save(updatedIdea, manager)

      // 아이디어 제시자의 역할이 바뀌었다면, member 도 수정
      const member = await this.memberRepository.findByUserIdAndGeneration(userId, idea.generation, manager);
      if(!member) {
        throw new CommonException(ErrorCode.NOT_FOUND_MEMBER);
      }

      if(member.role !== requestDto.providerRole) {
        const updatedMember = member.changeRole(requestDto.providerRole);
        this.memberRepository.save(updatedMember, manager);
      }
    });
  }

}