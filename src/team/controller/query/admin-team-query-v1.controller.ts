import { Controller, Get, Query, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadTeamOverviewService } from '../../application/service/read-team-overview.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadTeamOverviewQueryDto } from '../../application/dto/request/read-team-overview.query.dto';
import { ReadTeamOverviewResponseDto } from '../../application/dto/response/read-team-overview.response.dto';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminTeamQueryV1Controller {
  constructor(
    private readonly readTeamOverviewUseCase: ReadTeamOverviewService
  ) {}

  /**
   * 4.3 어드민 팀 요약 리스트 조회
   */
  @Get('teams/overviews')
  @UseGuards(JwtAuthGuard)
  async readTeamOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadTeamOverviewQueryDto,
  ): Promise<ResponseDto<ReadTeamOverviewResponseDto>> {
    return ResponseDto.ok(
      await this.readTeamOverviewUseCase.execute(
        req.user.id,
        query.page,
        query.size,
        query.generation,
        query.sorting,
        query.sortType,
        query.search
      )
    );
  }
}