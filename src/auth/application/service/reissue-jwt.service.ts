import { Injectable, UseFilters } from '@nestjs/common';
import { JwtTokenResponseDto } from '../dto/response/jwt-token.response.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { ESecurityRole } from '../../../core/enums/security-role.enum';
import { UserRepository } from '../../../user/repository/user.repository';

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
        const { userId, role } = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        });

        const user = await this.userRepository.findByIdAndRefreshTokenAndRole(userId, refreshToken, role, manager);

        const tokens = this.generateTokens(user.id, role);
        const updatedUser = user.updateRefreshToken(tokens.refreshToken);
        await this.userRepository.save(updatedUser);

        return tokens;

      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }
    });
  }

  private generateTokens(userId: number, role: ESecurityRole): JwtTokenResponseDto {
    const payload = { userId, role };
    const accessToken = this.jwtService.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

    return { accessToken, refreshToken };
  }
}
