import { Body, Controller, Post, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { CreateIdeaSubjectService } from '../../service/create-idea-subject.service';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { CreateIdeaSubjectRequestDto } from '../../dto/request/create-idea-subject.request.dto';
import { ResponseDto } from '../../../../core/dto/response.dto';

@Controller('/api/v1/admins/idea-subjects')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaSubjectUseCase: CreateIdeaSubjectService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createIdeaSubject(
    @Req() req,
    @Body (new ValidationPipe({ transform: true })) requestDto: CreateIdeaSubjectRequestDto
  ): Promise<ResponseDto<any>> {

    await this.createIdeaSubjectUseCase.execute(req.user.id, requestDto);
    return ResponseDto.created(null);
  }
}