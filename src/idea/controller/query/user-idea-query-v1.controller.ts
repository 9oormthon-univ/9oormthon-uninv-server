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
import { ReadIdeaOverviewService } from '../../application/service/read-idea-overview.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ReadIdeaOverviewQueryDto } from '../../application/dto/request/read-idea-overview.query.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadMyIdeaDetailService } from '../../application/service/read-my-idea-detail.service';
import { ReadIdeaDetailService } from '../../application/service/read-idea-detail.service';
import { ReadRemainPreferenceBriefService } from '../../application/service/read-remain-preference-brief.service';
import { ReadRemainPreferenceBriefQueryDto } from '../../application/dto/request/read-remain-preference-brief.query.dto';
import { ReadRemainPreferenceBriefResponseDto } from '../../application/dto/response/read-remain-preference-brief.response.dto';
import { ReadMyApplyOverviewService } from '../../application/service/read-my-apply-overview.service';
import { ReadMyApplyOverviewQueryDto } from '../../application/dto/request/read-my-apply-overview.query.dto';
import { ReadTeamApplyOverviewQueryDto } from '../../application/dto/request/read-team-apply-overview.query.dto';
import { ReadTeamApplyOverviewService } from '../../application/service/read-team-apply-overview.service';
import { ReadTeamApplyOverviewResponseDto } from '../../application/dto/response/read-team-apply-overview.response.dto';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaQueryV1Controller {
  constructor(
    private readonly readIdeaOverviewUseCase: ReadIdeaOverviewService,
    private readonly readMyIdeaDetailUseCase: ReadMyIdeaDetailService,
    private readonly readIdeaDetailUseCase: ReadIdeaDetailService,
    private readonly readRemainPreferenceBriefUseCase: ReadRemainPreferenceBriefService,
    private readonly readMyApplyOverviewUseCase: ReadMyApplyOverviewService,
    private readonly readTeamApplyOverviewUseCase: ReadTeamApplyOverviewService
  ) {}

  /**
   * 3.6 아이디어 요약 리스트 조회
   */
  @Get('ideas/overviews')
  @UseGuards(JwtAuthGuard)
  async readIdeaOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadIdeaOverviewQueryDto,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.readIdeaOverviewUseCase.execute(
      query.page,
      query.size,
      query.generation,
      query.subjectId,
      query.isActive,
      query.isBookmarked,
      req.user.id
      )
    );
  }

  /**
   * 3.7 내 아이디어 상세 조회
   */
  @Get('ideas/details')
  @UseGuards(JwtAuthGuard)
  async readMyIdeaDetail(
    @Req() req,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.readMyIdeaDetailUseCase.execute(
        req.user.id
      )
    );
  }

  /**
   * 3.8 아이디어 상세 조회
   */
  @Get('ideas/:id/details')
  @UseGuards(JwtAuthGuard)
  async readIdeaDetail(
    @Req() req,
    @Param('id') id: number,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.readIdeaDetailUseCase.execute(
        req.user.id,
        id
      )
    );
  }

  /**
   * 3.10 내 지원 정보 요약 리스트 조회
   */
  @Get('applies/overviews')
  @UseGuards(JwtAuthGuard)
  async readMyApplyOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadMyApplyOverviewQueryDto,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.readMyApplyOverviewUseCase.execute(
        req.user.id,
        query.generation,
        query.phase
      )
    );
  }

  /**
   * 3.11 내 잔여 지망 간단 리스트 조회
   */
  @Get('applies/briefs')
  @UseGuards(JwtAuthGuard)
  async readRemainPreferenceBrief(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadRemainPreferenceBriefQueryDto,
  ): Promise<ResponseDto<ReadRemainPreferenceBriefResponseDto>> {
    return ResponseDto.ok(
      await this.readRemainPreferenceBriefUseCase.execute(
        req.user.id,
        query
      )
    );
  }

  /**
   * 3.12 아이디어에 대한 지원 현황 리스트 조회
   */
  @Get('teams/applies/overviews')
  @UseGuards(JwtAuthGuard)
  async readTeamApplyOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadTeamApplyOverviewQueryDto,
  ): Promise<ResponseDto<ReadTeamApplyOverviewResponseDto>> {
    return ResponseDto.ok(await this.readTeamApplyOverviewUseCase.execute(req.user.id, query.generation, query.phase));
  }
}
