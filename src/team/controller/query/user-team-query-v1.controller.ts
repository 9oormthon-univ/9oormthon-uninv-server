import { Controller, Get, Query, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadTeamDetailService } from '../../application/service/read-team-detail.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadTeamDetailRequestDto } from '../../application/dto/request/read-team-detail.request.dto';

@Controller('/api/v1/users/teams')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserTeamQueryV1Controller {
  constructor(
    private readonly readTeamDetailUseCase: ReadTeamDetailService,
  ) {}

  /**
   * 4.1 팀 정보 조회
   */
  @Get('details')
  @UseGuards(JwtAuthGuard)
  async readTeamDetail(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadTeamDetailRequestDto,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readTeamDetailUseCase.execute(req.user.id, query.generation));
  }
}