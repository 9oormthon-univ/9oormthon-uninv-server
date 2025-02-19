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

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAuthBriefService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly ideaRepository: IdeaRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(accessToken: string, generation: number): Promise<any> {
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

      // 아이디어 제공자인지 확인
      let isProvider = false;
      const idea = await this.ideaRepository.findByUserIdAndGeneration(userId, generation, manager);
      if (idea) {
        isProvider = true;
      }

      return ReadAuthBriefResponseDto.of(user.role, user.imgUrl, isProvider);
    });
  }
}
