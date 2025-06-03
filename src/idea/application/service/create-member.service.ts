import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { DataSource } from 'typeorm';
import { MemberRepository } from '../../../team/repository/member.repository';
import { CreateMemberRequestDto } from '../dto/request/create-member.request.dto';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { TeamRepository } from '../../../team/repository/team.repository';
import { MemberModel } from '../../../team/domain/member.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateMemberService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly memberRepository: MemberRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(adminId: number, teamId: number, requestDto: CreateMemberRequestDto): Promise<void> {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      const team = await this.teamRepository.findById(teamId, manager);
      if (!team) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }
      // 해당 유저가 이미 팀을 갖고있는지 확인
      const user = await this.userRepository.findById(requestDto.userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      const existedMember = await this.memberRepository.findByUserIdAndGeneration(user.id, team.generation, manager);
      if (existedMember) {
        throw new CommonException(ErrorCode.ALREADY_HAVE_TEAM_ERROR);
      }

      // 멤버 생성
      const member = MemberModel.createMember(
        requestDto.role,
        user,
        team,
      );

      await this.memberRepository.save(member, manager);
    });
  }
}