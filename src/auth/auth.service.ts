import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async signUp(authSignUpDto: AuthSignUpDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(authSignUpDto.password, 10);
    await this.userRepository.save({
      serialId: authSignUpDto.serialId,
      password: hashedPassword,
    });
  }

  async login(authSignUpDto: AuthSignUpDto): Promise<JwtTokenDto> {
    const user = await this.userRepository.findOne({
      where: { serialId: authSignUpDto.serialId },
    });

    if (!user) {
      throw new CommonException(ErrorCode.NOT_FOUND_USER);
    }

    const isPasswordValid = await bcrypt.compare(
      authSignUpDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new CommonException(ErrorCode.FAILURE_LOGIN);
    }

    const tokens = this.generateTokens(user.id);
    user.refreshToken = tokens.refreshToken;
    user.isLogin = true;
    await this.userRepository.save(user);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (user) {
      user.refreshToken = null;
      user.isLogin = false;
      await this.userRepository.save(user);
    }
  }

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new CommonException(ErrorCode.NOT_FOUND_USER);
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new CommonException(ErrorCode.FAILURE_CHANGE_PASSWORD);
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async reissue(userId: number, refreshToken: string): Promise<JwtTokenDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId, refreshToken, isLogin: true },
    });

    if (!user) {
      throw new Error('User not found or not logged in');
    }

    const tokens = this.generateTokens(user.id);
    user.refreshToken = tokens.refreshToken;
    await this.userRepository.save(user);

    return tokens;
  }

  private generateTokens(userId: number): JwtTokenDto {
    const payload = { userId };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' }); // accessToken 1시간 유효
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' }); // refreshToken 14일 유효

    return { accessToken, refreshToken };
  }
}
