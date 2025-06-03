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
import { ReadUserBriefService } from '../../application/service/read-user-brief.service';
import { ReadUserBriefRequestDto } from '../../application/dto/request/read-user-brief.request.dto';
import { ReadUserOverviewService } from '../../application/service/read-user-overview.service';
import { ReadUserOverviewQueryDto } from '../../application/dto/request/read-user-overview.request.dto';
import { ReadAdminUserDetailService } from '../../application/service/read-admin-user-detail.service';
import { ReadAdminUserDetailRequestDto } from '../../application/dto/request/read-admin-user-detail.request.dto';

@Controller('/api/v1')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserQueryV1Controller {
  constructor(
    private readonly readMyUserDetailUseCase: ReadMyUserDetailService,
    private readonly readUserDetailUseCase: ReadUserDetailService,
    private readonly readUserBriefUseCase: ReadUserBriefService,
    private readonly readUserOverviewUseCase: ReadUserOverviewService,
    private readonly readAdminUserDetailUseCase: ReadAdminUserDetailService,
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

  @Get('admins/users/briefs')
  @UseGuards(JwtAuthGuard)
  async getUserBriefs(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUserBriefRequestDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserBriefUseCase.execute(req.user.id, query.univId, query.search, query.generation));
  }

  @Get('admins/users/overviews')
  @UseGuards(JwtAuthGuard)
  async getUserOverviews(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUserOverviewQueryDto
  ) : Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserOverviewUseCase.execute(query.page, query.size, req.user.id, query.generation, query.univId, query.search));
  }

  @Get('admins/users/:userId(\\d+)/details')
  @UseGuards(JwtAuthGuard)
  async getAdminUserDetail(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadAdminUserDetailRequestDto,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readAdminUserDetailUseCase.execute(req.user.id, userId, query.generation));
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