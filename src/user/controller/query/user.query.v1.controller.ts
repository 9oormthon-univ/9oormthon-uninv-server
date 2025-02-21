import { Controller, Get, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadMyUserDetailService } from '../../application/service/read-my-user-detail.service';
import { ReadUserDetailService } from '../../application/service/read-user-detail.service';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserQueryV1Controller {
  constructor(
    private readonly readMyUserDetailUseCase: ReadMyUserDetailService,
    private readonly readUserDetailUseCase: ReadUserDetailService

  ) {}

  @Get('details')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readMyUserDetailUseCase.execute(req.user.id));
  }

  @Get(':userId/details')
  @UseGuards(JwtAuthGuard)
  async getUserDetail(@Req() req): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserDetailUseCase.execute(req.params.userId));
  }
}