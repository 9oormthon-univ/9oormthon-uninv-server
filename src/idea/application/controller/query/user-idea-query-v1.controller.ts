import { Controller, Get, Query, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { ReadIdeaOverviewService } from '../../service/read-idea-overview.service';
import { ReadIdeaOverviewResponseDto } from '../../dto/response/read-idea-overview.response.dto';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { ReadIdeaOverviewQueryDto } from '../../dto/request/read-idea-overview.request.dto';

@Controller('/api/v1/users/ideas')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaQueryV1Controller {
  constructor(
    private readonly readIdeaOverviewUseCase: ReadIdeaOverviewService
  ) {}

  @Get('overviews')
  @UseGuards(JwtAuthGuard)
  async readIdeaOverview(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadIdeaOverviewQueryDto,
  ): Promise<ReadIdeaOverviewResponseDto> {
    return this.readIdeaOverviewUseCase.execute(
      query.page,
      query.size,
      query.generation,
      query.subjectId,
      query.isActive,
      query.isBookmarked,
      req.user.id
    );
  }
}
