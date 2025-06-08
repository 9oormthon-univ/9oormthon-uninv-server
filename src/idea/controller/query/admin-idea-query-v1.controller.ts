import { Controller, Get, Query, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadAdminIdeaSubjectBriefService } from '../../application/service/read-admin-idea-subject-brief.service';
import {
  ReadAdminIdeaSubjectBriefQueryDto,
} from '../../application/dto/request/read-admin-idea-subject-brief.query.dto';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaQueryV1Controller {
  constructor(
    private readonly readAdminIdeaSubjectBriefService: ReadAdminIdeaSubjectBriefService,
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
    return ResponseDto.ok(await this.readAdminIdeaSubjectBriefService.execute(req.user.id, query.generation));
  }
}