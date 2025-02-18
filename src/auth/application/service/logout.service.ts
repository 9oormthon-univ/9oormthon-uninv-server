import { Injectable, UseFilters } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class LogoutService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource,
  ) {
  }

  async execute(refreshToken: string): Promise<void> {
    return this.dataSource.transaction(async (manager) => {

      let payload: any;
      try {
        // 리프레시 토큰 검증
        payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        })
      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }

      const { userId, role } = payload;

      // 유저 조회
      const user = await this.userRepository.findByRefreshTokenAndId(refreshToken, userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }

      // 리프레시 토큰 null 로 업데이트
      const updatedUser = user.updateRefreshToken(null);

      await this.userRepository.save(updatedUser);
    });
  }
}
