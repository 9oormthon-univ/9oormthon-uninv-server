import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { CreateIdeaUseCase } from '../usecase/create-idea.usecase';
import { CreateIdeaRequestDto } from '../dto/request/create-idea.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { IdeaRepositoryImpl } from '../../repository/idea.repository.impl';
import { IdeaSubjectRepositoryImpl } from '../../repository/idea-subject.repository.impl';
import { IdeaModel } from '../../domain/idea.model';
import { TeamRepositoryImpl } from '../../../team/repository/team.repository.impl';
import { TeamModel } from '../../../team/domain/team.model';
import { MemberRepositoryImpl } from '../../../team/repository/member.repository.impl';
import { MemberModel } from '../../../team/domain/member.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateIdeaService implements CreateIdeaUseCase{
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly ideaRepository: IdeaRepositoryImpl,
    private readonly ideaSubjectRepository: IdeaSubjectRepositoryImpl,
    private readonly teamRepository: TeamRepositoryImpl,
    private readonly memberRepository: MemberRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId:number, requestDto: CreateIdeaRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      const user = await this.userRepository.findById(userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const ideaSubject = await this.ideaSubjectRepository.findById(requestDto.ideaInfo.ideaSubjectId, manager);
      if(!ideaSubject){
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const existedIdea = await this.ideaRepository.findByUserId(userId, manager);
      if(existedIdea.length > 0){
        throw new CommonException(ErrorCode.ALREADY_SUBMITTED_IDEA);
      }

      const idea = IdeaModel.createIdea(
        requestDto.ideaInfo.title,
        requestDto.ideaInfo.summary,
        requestDto.ideaInfo.content,
        requestDto.ideaInfo.generation,
        requestDto.requirements.pm.requirement,
        requestDto.requirements.pm.requiredTechStacks,
        requestDto.requirements.pd.requirement,
        requestDto.requirements.pd.requiredTechStacks,
        requestDto.requirements.fe.requirement,
        requestDto.requirements.fe.requiredTechStacks,
        requestDto.requirements.be.requirement,
        requestDto.requirements.be.requiredTechStacks,
        user,
        ideaSubject
      )
      const createdIdea = await this.ideaRepository.save(idea, manager);

      const team = TeamModel.createTeam(
        null,
        null,
        idea.generation,
        requestDto.requirements.pm.capacity,
        requestDto.requirements.pd.capacity,
        requestDto.requirements.fe.capacity,
        requestDto.requirements.be.capacity,
        createdIdea
      );

      const createdTeam = await this.teamRepository.save(team, manager);

      const member = MemberModel.createMember(
        requestDto.ideaInfo.providerRole,
        user,
        createdTeam
      );

      await this.memberRepository.save(member, manager);
    });
  }
}
