import { Controller, Get, Param, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadMyUserDetailService } from '../../application/service/read-my-user-detail.service';
import { ReadUserDetailService } from '../../application/service/read-user-detail.service';

@Controller('/api/v1')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserQueryV1Controller {
  constructor(
    private readonly readMyUserDetailUseCase: ReadMyUserDetailService,
    private readonly readUserDetailUseCase: ReadUserDetailService

  ) {}

  @Get('users/details')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readMyUserDetailUseCase.execute(req.user.id));
  }

  @Get('users/:userId(\\d+)/details')
  @UseGuards(JwtAuthGuard)
  async getUserDetail(
    @Req() req,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserDetailUseCase.execute(req.user.id, userId));
  }
}