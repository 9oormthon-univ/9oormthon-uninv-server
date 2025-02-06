import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminSignUpDto } from './dto/admin-sign-up.dto';
import { JwtTokenDto } from './dto/jwt-token.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CookieUtil } from '../common/utils/cookie.util';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResponseDto } from '../common/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginDto } from './dto/login.dto';

@Controller('/api/v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 1.1 로그인
   */
  @Post('/auth/login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe({ transform: true }))
    loginDto: LoginDto,
    @Res() res: Response,
  ): Promise<any> {
    const jwtTokenDto: JwtTokenDto = await this.authService.login(loginDto);

    CookieUtil.addCookie(res, 'access_token', jwtTokenDto.accessToken);

    CookieUtil.addSecureCookie(
      res,
      'refresh_token',
      jwtTokenDto.refreshToken,
      60 * 60 * 24 * 14,
    );
    return res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.2 로그아웃
   */
  @Post('/auth/logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<any> {
    const refreshToken = CookieUtil.refineCookie(req, 'refresh_token');
    await this.authService.logout(refreshToken);

    CookieUtil.deleteCookie(req, res, 'access_token');
    CookieUtil.deleteCookie(req, res, 'refresh_token');
    return res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.3 어드민 회원가입
   */
  @Post('/auth/sign-up-admin')
  async signUpAdmin(
    @Body(new ValidationPipe({ transform: true }))
    requestDto: AdminSignUpDto,
  ): Promise<ResponseDto<any>> {
    await this.authService.signUpAdmin(requestDto);
    return ResponseDto.created(null);
  }

  /**
   * 1.4 회원가입 일괄처리
   * @param req
   * @param file
   */
  @Post('/auth/sign-up')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async signUp(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    await this.authService.signUp(req.user.id, file);
    return ResponseDto.created(null);
  }

  /**
   * 1.5 JWT 재발급
   */
  @Post('/auth/reissue')
  @HttpCode(200)
  async reissue(@Req() req: Request, @Res() res: Response): Promise<any> {
    const refreshToken = CookieUtil.refineCookie(req, 'refresh_token');

    const jwtTokenDto: JwtTokenDto =
      await this.authService.reissue(refreshToken);

    CookieUtil.addSecureCookie(
      res,
      'refresh_token',
      jwtTokenDto.refreshToken,
      60 * 60 * 24 * 14,
    );

    return res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.6 비밀번호 변경
   */
  @Patch('/auth/password')
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
}
