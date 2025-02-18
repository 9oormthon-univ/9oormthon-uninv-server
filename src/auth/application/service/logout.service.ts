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
        payload = this.jwtService.verify(refreshToken, {
          secret: process.env.JWT_SECRET,
        })
      } catch (error) {
        throw new CommonException(ErrorCode.INVALID_TOKEN_ERROR);
      }

      const { userId, role } = payload;

      const user = await this.userRepository.findByRefreshTokenAndId(refreshToken, userId, manager);
      if (!user) {
        throw new CommonException(ErrorCode.NOT_FOUND_LOGIN_USER);
      }
      const updatedUser = user.updateRefreshToken(null);
      await this.userRepository.save(updatedUser);
    });
  }
}
