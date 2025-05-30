import {
  Controller,
  Get,
  Param,
  Query,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadMyUserDetailService } from '../../application/service/read-my-user-detail.service';
import { ReadUserDetailService } from '../../application/service/read-user-detail.service';
import { ReadUnivBriefService } from '../../application/service/read-univ-brief.service';
import { ReadUnivBriefRequestDto } from '../../application/dto/request/read-univ-brief.request.dto';
import { ReadUnivDetailService } from '../../application/service/read-univ-detail.service';

@Controller('/api/v1')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserQueryV1Controller {
  constructor(
    private readonly readMyUserDetailUseCase: ReadMyUserDetailService,
    private readonly readUserDetailUseCase: ReadUserDetailService,
    private readonly readUnivBriefsUseCase: ReadUnivBriefService,
    private readonly readUnivDetailUseCase: ReadUnivDetailService,
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

  @Get('admins/univs/briefs')
  @UseGuards(JwtAuthGuard)
  async getUnivBriefs(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUnivBriefRequestDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUnivBriefsUseCase.execute(req.user.id, query.generation));
  }

  @Get('admins/univs/:univId(\\d+)/details')
  @UseGuards(JwtAuthGuard)
  async getUnivDetail(
    @Req() req,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUnivDetailUseCase.execute(req.user.id, univId));
  }

}