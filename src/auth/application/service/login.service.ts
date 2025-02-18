import { Injectable, UseFilters } from '@nestjs/common';
import { JwtTokenResponseDto } from '../dto/response/jwt-token.response.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../../../core/enums/security-role.enum';
import { LoginRequestDto } from '../dto/request/login.request.dto';
import { UserRepository } from '../../../user/repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class LoginService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(requestDto: LoginRequestDto): Promise<JwtTokenResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 유저 조회
      const user = await this.userRepository.findBySerialId(requestDto.serialId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.FAILURE_LOGIN);
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(
        requestDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new CommonException(ErrorCode.FAILURE_LOGIN);
      }

      // 토큰 생성
      const tokens = this.generateTokens(user.id, user.role);

      // 리프레시 토큰 업데이트
      const updatedUser = user.updateRefreshToken(tokens.refreshToken);

      await this.userRepository.save(updatedUser);

      return tokens;
    });
  }

  private generateTokens(userId: number, role: ESecurityRole): JwtTokenResponseDto {
    const payload = { userId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken };
  }
}
