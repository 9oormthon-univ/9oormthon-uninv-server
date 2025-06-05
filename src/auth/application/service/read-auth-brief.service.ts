import { Injectable, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../../../core/enums/security-role.enum';
import { ReadAuthBriefResponseDto } from '../dto/response/read-auth-brief.response.dto';
import { UserRepository } from '../../../user/repository/user.repository';
import { IdeaRepository } from '../../../idea/repository/idea.repository';
import { ReadAuthBriefQueryDto } from '../dto/request/read-auth-brief.query.dto';
import { MemberRepository } from '../../../team/repository/member.repository';
import { EUserStatus } from '../../../core/enums/user-status.enum';
import { ApplyRepository } from '../../../idea/repository/apply.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAuthBriefService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly memberRepository: MemberRepository,
    private readonly applyRepository: ApplyRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(accessToken: string, requestDto: ReadAuthBriefQueryDto): Promise<any> {
    return this.dataSource.transaction(async (manager) => {

      let payload: any;

      try {
        // 액세스 토큰 검증
        payload = this.jwtService.verify(accessToken, {
          secret: process.env.JWT_SECRET,
        });
      } catch (error) {
        return ReadAuthBriefResponseDto.of(ESecurityRole.GUEST, null, null);
      }

      const { userId, role } = payload;

      // 유저 조회
      const user = await this.userRepository.findByIdAndRole(userId, role, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }

      // 아이디어 제시자면 PROVIDER 반환
      const idea = await this.ideaRepository.findByUserIdAndGeneration(userId, requestDto.generation, manager);
      if (idea) {
        return ReadAuthBriefResponseDto.of(user.role, user.imgUrl, EUserStatus.PROVIDER);
      }

      // 팀 멤버면 MEMBER 반환
      const member = await this.memberRepository.findByUserIdAndGeneration(userId, requestDto.generation, manager);
      if (member) {
        return ReadAuthBriefResponseDto.of(user.role, user.imgUrl, EUserStatus.MEMBER);
      }

      // 지원자면 APPLICANT 반환
      const apply = await this.applyRepository.findByUserIdAndGeneration(userId, requestDto.generation, manager);
      if (apply) {
        return ReadAuthBriefResponseDto.of(user.role, user.imgUrl, EUserStatus.APPLICANT);
      }

      // 그 외 NONE 반환
      return ReadAuthBriefResponseDto.of(user.role, user.imgUrl, EUserStatus.NONE);
    });
  }
}
