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
import { ReadTeamOverviewService } from '../../application/service/read-team-overview.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadTeamOverviewQueryDto } from '../../application/dto/request/read-team-overview.query.dto';
import { ReadTeamOverviewResponseDto } from '../../application/dto/response/read-team-overview.response.dto';
import { ReadMemberOverviewService } from '../../application/service/read-member-overview.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminTeamQueryV1Controller {
  constructor(
    private readonly readTeamOverviewUseCase: ReadTeamOverviewService,
    private readonly readMemberOverviewUseCase: ReadMemberOverviewService,
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

  /**
   * 4.4 어드민 팀원 정보 요약 리스트 조회
   */
  @Get('teams/:teamId(\\d+)/members/overviews')
  @UseGuards(JwtAuthGuard)
  async readMemberOverview(
    @Req() req,
    @Param('teamId') teamId: number
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.readMemberOverviewUseCase.execute(
        req.user.id,
        teamId
      )
    );
  }
}