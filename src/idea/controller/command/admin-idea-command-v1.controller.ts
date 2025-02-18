import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CreateIdeaSubjectService } from '../../application/service/create-idea-subject.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CreateIdeaSubjectRequestDto } from '../../application/dto/request/create-idea-subject.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { UpdateIdeaSubjectIsActiveService } from '../../application/service/update-idea-subject-is-active.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaSubjectUseCase: CreateIdeaSubjectService,
    private readonly updateIdeaSubjectIsActiveUseCase: UpdateIdeaSubjectIsActiveService
  ) {}

  /**
   * 3.2 아이디어 주제 생성
   */
  @Post('/idea-subjects')
  @UseGuards(JwtAuthGuard)
  async createIdeaSubject(
    @Req() req,
    @Body (new ValidationPipe({ transform: true })) requestDto: CreateIdeaSubjectRequestDto
  ): Promise<ResponseDto<any>> {

    await this.createIdeaSubjectUseCase.execute(req.user.id, requestDto);
    return ResponseDto.created(null);
  }

  /**
   * 3.3 아이디어 주제 노출 상태 토글(활성화 or 비활성화)
   */
  @Post('/idea-subjects/:id/toggle-active')
  @UseGuards(JwtAuthGuard)
  async toggleIdeaSubjectIsActive(
    @Req() req,
    @Param('id') id: number
  ): Promise<ResponseDto<any>> {

    await this.updateIdeaSubjectIsActiveUseCase.execute(req.user.id, id);
    return ResponseDto.ok(null);
  }

}