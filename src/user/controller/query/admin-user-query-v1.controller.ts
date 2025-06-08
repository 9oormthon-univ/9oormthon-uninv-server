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
import { ReadUnivBriefService } from '../../application/service/read-univ-brief.service';
import { ReadUnivBriefQueryDto } from '../../application/dto/request/read-univ-brief.query.dto';
import { ReadUnivDetailService } from '../../application/service/read-univ-detail.service';
import { ReadUserBriefService } from '../../application/service/read-user-brief.service';
import { ReadUserBriefQueryDto } from '../../application/dto/request/read-user-brief.query.dto';
import { ReadUserOverviewService } from '../../application/service/read-user-overview.service';
import { ReadUserOverviewQueryDto } from '../../application/dto/request/read-user-overview.query.dto';
import { ReadAdminUserDetailService } from '../../application/service/read-admin-user-detail.service';
import { ReadAdminUserDetailQueryDto } from '../../application/dto/request/read-admin-user-detail.query.dto';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminUserQueryV1Controller {
  constructor(
    private readonly readUserBriefUseCase: ReadUserBriefService,
    private readonly readUserOverviewUseCase: ReadUserOverviewService,
    private readonly readAdminUserDetailUseCase: ReadAdminUserDetailService,
    private readonly readUnivBriefsUseCase: ReadUnivBriefService,
    private readonly readUnivDetailUseCase: ReadUnivDetailService,
  ) {}

  /**
   * 2.5 어드민 유저 간단 리스트 조회
   */
  @Get('users/briefs')
  @UseGuards(JwtAuthGuard)
  async getUserBriefs(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUserBriefQueryDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserBriefUseCase.execute(req.user.id, query.univId, query.teamId, query.search, query.generation));
  }

  /**
   * 2.6 어드민 유저 요약 리스트 조회
   */
  @Get('users/overviews')
  @UseGuards(JwtAuthGuard)
  async getUserOverviews(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUserOverviewQueryDto
  ) : Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserOverviewUseCase.execute(query.page, query.size, req.user.id, query.generation, query.univId, query.sorting, query.sortType, query.search));
  }

  /**
   * 2.7 어드민 유저 상세 조회
   */
  @Get('users/:userId(\\d+)/details')
  @UseGuards(JwtAuthGuard)
  async getAdminUserDetail(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadAdminUserDetailQueryDto,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readAdminUserDetailUseCase.execute(req.user.id, userId, query.generation));
  }

  /**
   * 6.2 어드민 유니브 간단 리스트 조회
   */
  @Get('univs/briefs')
  @UseGuards(JwtAuthGuard)
  async getUnivBriefs(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadUnivBriefQueryDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUnivBriefsUseCase.execute(req.user.id, query.generation));
  }

  /**
   * 6.3 어드민 유니브 상세 조회
   */
  @Get('univs/:univId(\\d+)/details')
  @UseGuards(JwtAuthGuard)
  async getUnivDetail(
    @Req() req,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUnivDetailUseCase.execute(req.user.id, univId));
  }

}