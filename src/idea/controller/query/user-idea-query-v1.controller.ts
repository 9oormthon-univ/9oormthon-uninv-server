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
import { ReadIdeaOverviewQueryDto } from '../../application/dto/request/read-idea-overview.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { ReadMyIdeaDetailService } from '../../application/service/read-my-idea-detail.service';
import { ReadIdeaDetailService } from '../../application/service/read-idea-detail.service';
import { ReadRemainPreferenceBriefService } from '../../application/service/read-remain-preference-brief.service';
import { ReadRemainPreferenceBriefRequestDto } from '../../application/dto/request/read-remain-preference-brief.request.dto';
import { ReadRemainPreferenceBriefResponseDto } from '../../application/dto/response/read-remain-preference-brief.response.dto';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaQueryV1Controller {
  constructor(
    private readonly readIdeaOverviewUseCase: ReadIdeaOverviewService,
    private readonly readMyIdeaDetailUseCase: ReadMyIdeaDetailService,
    private readonly readIdeaDetailUseCase: ReadIdeaDetailService,
    private readonly readRemainPreferenceBriefUseCase: ReadRemainPreferenceBriefService
  ) {}

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

  @Get('applies/briefs')
  @UseGuards(JwtAuthGuard)
  async readRemainPreferenceBrief(
    @Req() req,
    @Query(new ValidationPipe({ transform: true, whitelist: true })) query: ReadRemainPreferenceBriefRequestDto,
  ): Promise<ResponseDto<ReadRemainPreferenceBriefResponseDto>> {
    return ResponseDto.ok(
      await this.readRemainPreferenceBriefUseCase.execute(
        req.user.id,
        query
      )
    );
  }
}
