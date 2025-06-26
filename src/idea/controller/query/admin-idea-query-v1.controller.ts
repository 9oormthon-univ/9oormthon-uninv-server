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
import { ReadAdminIdeaSubjectBriefService } from '../../application/service/read-admin-idea-subject-brief.service';
import {
  ReadAdminIdeaSubjectBriefQueryDto,
} from '../../application/dto/request/read-admin-idea-subject-brief.query.dto';
import { ReadAdminIdeaOverviewService } from '../../application/service/read-admin-idea-overview.service';
import { ReadAdminIdeaOverviewQueryDto } from '../../application/dto/request/read-admin-idea-overview.query.dto';
import { ReadAdminIdeaDetailService } from '../../application/service/read-admin-idea-detail.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaQueryV1Controller {
  constructor(
    private readonly readAdminIdeaSubjectBriefUseCase: ReadAdminIdeaSubjectBriefService,
    private readonly readAdminIdeaOverviewUseCase: ReadAdminIdeaOverviewService,
    private readonly readAdminIdeaDetailUseCase: ReadAdminIdeaDetailService,
  ) {}

  /**
   * 3.18 어드민 아이디어 주제 간단 리스트 조회
   */
  @Get('idea-subjects/briefs')
  @UseGuards(JwtAuthGuard)
  async readIdeaSubjectBrief(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadAdminIdeaSubjectBriefQueryDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readAdminIdeaSubjectBriefUseCase.execute(req.user.id, query.generation));
  }

  /**
   * 3.22 어드민 아이디어 요약 리스트 조회
   */
  @Get('ideas/overviews')
  @UseGuards(JwtAuthGuard)
  async readAdminIdeaOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadAdminIdeaOverviewQueryDto
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readAdminIdeaOverviewUseCase.execute(req.user.id, query));
  }

  /**
   * 3.23 어드민 아이디어 상세 조회
   */
  @Get('ideas/:ideaId/details')
  @UseGuards(JwtAuthGuard)
  async readAdminIdeaDetail(
    @Req() req,
    @Param('ideaId') ideaId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readAdminIdeaDetailUseCase.execute(req.user.id, ideaId));
  }

}