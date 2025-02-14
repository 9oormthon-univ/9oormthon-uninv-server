import { Controller, Get, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { ReadIdeaSubjectBriefService } from '../../service/read-idea-subject-brief.service';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../../core/dto/response.dto';

@Controller('/api/v1/idea-subjects')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class IdeaQueryV1Controller {
  constructor(
    private readonly readIdeaSubjectBriefUseCase: ReadIdeaSubjectBriefService,
  ) {}

  @Get('briefs')
  @UseGuards(JwtAuthGuard)
  async readIdeaSubjectBrief(): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readIdeaSubjectBriefUseCase.execute());
  }
}