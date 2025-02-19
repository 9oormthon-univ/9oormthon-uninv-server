import {
  Body,
  Controller, Get,
  HttpCode,
  Patch,
  Post, Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { SignUpAdminRequestDto } from '../application/dto/request/sign-up-admin.request.dto';
import { JwtTokenResponseDto } from '../application/dto/response/jwt-token.response.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CookieUtil } from '../../core/utils/cookie.util';
import { UpdatePasswordRequestDto } from '../application/dto/request/update-password.request.dto';
import { ResponseDto } from '../../core/dto/response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { LoginRequestDto } from '../application/dto/request/login.request.dto';
import { ChangePasswordService } from '../application/service/change-password.service';
import { LoginService } from '../application/service/login.service';
import { LogoutService } from '../application/service/logout.service';
import { ReadAuthBriefService } from '../application/service/read-auth-brief.service';
import { ReissueJwtService } from '../application/service/reissue-jwt.service';
import { SignUpService } from '../application/service/sign-up.service';
import { SignUpAdminService } from '../application/service/sign-up-admin.service';

@Controller('/api/v1')
export class AuthController {
  constructor(
    private readonly changePasswordUseCase: ChangePasswordService,
    private readonly loginUseCase: LoginService,
    private readonly logoutUseCase: LogoutService,
    private readonly readAuthBriefUseCase: ReadAuthBriefService,
    private readonly reissueJwtUseCase: ReissueJwtService,
    private readonly signUpUseCase: SignUpService,
    private readonly signUpAdminUseCase: SignUpAdminService,
    ) {}

  /**
   * 1.1 로그인
   */
  @Post('/auth/login')
  @HttpCode(200)
  async login(
    @Body(new ValidationPipe({ transform: true }))
    requestDto: LoginRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const jwtTokenDto: JwtTokenResponseDto = await this.loginUseCase.execute(requestDto);

    CookieUtil.addCookie(res, 'access_token', jwtTokenDto.accessToken);

    CookieUtil.addSecureCookie(
      res,
      'refresh_token',
      jwtTokenDto.refreshToken,
      60 * 60 * 24 * 14,
    );
    res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.2 로그아웃
   */
  @Post('/auth/logout')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = CookieUtil.refineCookie(req, 'refresh_token');
    await this.logoutUseCase.execute(refreshToken);

    CookieUtil.deleteCookie(req, res, 'access_token');
    CookieUtil.deleteCookie(req, res, 'refresh_token');
    res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.3 어드민 회원가입
   */
  @Post('/auth/sign-up-admin')
  async signUpAdmin(
    @Body(new ValidationPipe({ transform: true }))
    requestDto: SignUpAdminRequestDto,
  ): Promise<ResponseDto<any>> {
    await this.signUpAdminUseCase.execute(requestDto);
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
    await this.signUpUseCase.execute(req.user.id, file);
    return ResponseDto.created(null);
  }

  /**
   * 1.5 JWT 재발급
   */
  @Post('/auth/reissue')
  @HttpCode(200)
  async reissue(@Req() req: Request, @Res() res: Response): Promise<void> {
    const refreshToken = CookieUtil.refineCookie(req, 'refresh_token');

    const jwtTokenDto: JwtTokenResponseDto =
      await this.reissueJwtUseCase.execute(refreshToken);

    CookieUtil.addCookie(res, 'access_token', jwtTokenDto.accessToken);

    CookieUtil.addSecureCookie(
      res,
      'refresh_token',
      jwtTokenDto.refreshToken,
      60 * 60 * 24 * 14,
    );

    res.json({ success: true, data: null, error: null });
  }

  /**
   * 1.6 인증 정보 간단 조회
   */
  @Get('/auth/briefs')
  async getAuthBriefs(
    @Req() req: Request,
    @Query('generation') generation: number,
  ): Promise<ResponseDto<any>> {
    const accessToken = CookieUtil.refineCookie(req, 'access_token');
    const authBriefs = await this.readAuthBriefUseCase.execute(accessToken, generation);

    return ResponseDto.ok(authBriefs);
  }

  /**
   * 1.7 비밀번호 재설정
   */
  @Patch('/auth/password')
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: Request,
    @Body(new ValidationPipe({ transform: true }))
    requestDto: UpdatePasswordRequestDto,
  ): Promise<ResponseDto<any>> {
    const userId = req.user.id;
    await this.changePasswordUseCase.execute(userId, requestDto);
    return ResponseDto.ok(null);
  }
}
