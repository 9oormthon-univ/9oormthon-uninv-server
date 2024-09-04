import {
  Controller,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignUpDto } from './dto/auth-sign-up.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CookieUtil } from '../common/utils/cookie.util';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseDto } from '../common/dto/response.dto';

@Controller('api/v1')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('auth/sign-up')
  async signUp(
    @Body(new ValidationPipe({ transform: true })) authSignUpDto: AuthSignUpDto,
  ): Promise<ResponseDto<any>> {
    await this.authService.signUp(authSignUpDto);
    return ResponseDto.created(null);
  }

  @Post('auth/login')
  async login(
    @Body(new ValidationPipe({ transform: true })) authSignUpDto: AuthSignUpDto,
    @Res() res: Response,
  ): Promise<any> {
    const jwtTokenDto: JwtTokenDto =
      await this.authService.login(authSignUpDto);

    CookieUtil.addSecureCookie(
      res,
      'refresh_token',
      jwtTokenDto.refreshToken,
      60 * 60 * 24 * 14,
    );
    res.redirect('https://9oormthon.university');
  }
  @Post('auth/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    const userId = req.user.id;
    await this.authService.logout(userId);

    CookieUtil.deleteCookie(req, res, 'refresh_token');
    return res.json({ success: true, message: 'Logged out successfully' });
  }

  @Patch('auth/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true }))
    changePasswordDto: ChangePasswordDto,
  ): Promise<ResponseDto<any>> {
    const userId = req.user.id;
    await this.authService.changePassword(userId, changePasswordDto);
    return ResponseDto.ok(null);
  }

  @Post('auth/reissue')
  async reissue(@Req() req: Request, @Res() res: Response): Promise<any> {
    const refreshToken = CookieUtil.refineCookie(req, 'refresh_token');

    if (!refreshToken) {
      throw new BadRequestException('Missing refresh token');
    }
    try {
      const { userId } = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const jwtTokenDto: JwtTokenDto = await this.authService.reissue(
        userId,
        refreshToken,
      );

      CookieUtil.addSecureCookie(
        res,
        'refresh_token',
        jwtTokenDto.refreshToken,
        60 * 60 * 24 * 14,
      );

      return res.json({ success: true, data: jwtTokenDto });
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
