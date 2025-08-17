import { Injectable, UseFilters } from '@nestjs/common';
import { JwtTokenResponseDto } from '../dto/response/jwt-token.response.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../../../core/enums/security-role.enum';
import { UserRepository } from '../../../user/repository/user.repository';
import { JwtConstant } from '../../../core/constants/jwt-constant';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReissueJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(refreshToken?: string): Promise<JwtTokenResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      try {
        // 리프레시 토큰 검증
        const { userId, role, tokenType } = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        if (tokenType !== JwtConstant.REFRESH_TOKEN) {
          throw new CommonException(ErrorCode.TOKEN_TYPE_ERROR);
        }

        // 유저 조회
        const user = await this.userRepository.findByIdAndRefreshTokenAndRole(userId, refreshToken, role, manager);

        // 토큰 생성
        const tokens = this.generateTokens(user.id, role);

        // 리프레시 토큰 업데이트
        const updatedUser = user.updateRefreshToken(tokens.refreshToken);

        await this.userRepository.save(updatedUser);

        return tokens;

      } catch (error) {
        if (error instanceof CommonException) {
          throw error;
        }
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }
    });
  }

  private generateTokens(userId: number, role: ESecurityRole): JwtTokenResponseDto {
    const accessTokenType = JwtConstant.ACCESS_TOKEN;
    const refreshTokenType = JwtConstant.REFRESH_TOKEN;

    const accessToken = this.jwtService.sign({ userId, role, tokenType: accessTokenType }, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtService.sign({ userId, role, tokenType: refreshTokenType }, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken };
  }
}
