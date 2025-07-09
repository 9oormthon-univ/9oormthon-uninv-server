import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
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
import { UpdateIdeaSubjectService } from '../../application/service/update-idea-subject.service';
import { DeleteIdeaSubjectService } from '../../application/service/delete-idea-subject.service';
import { UpdateIdeaSubjectRequestDto } from '../../application/dto/request/update-idea-subject.request.dto';
import { DeleteAdminIdeaService } from '../../application/service/delete-admin-idea.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaSubjectUseCase: CreateIdeaSubjectService,
    private readonly updateIdeaSubjectUseCase: UpdateIdeaSubjectService,
    private readonly deleteIdeaSubjectUseCase: DeleteIdeaSubjectService,
    private readonly deleteAdminIdeaUseCase: DeleteAdminIdeaService,
  ) {}

  /**
   * 3.19 아이디어 주제 생성
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
   * 3.20 아이디어 주제 수정
   */
  @Put('/idea-subjects/:ideaSubjectId')
  @UseGuards(JwtAuthGuard)
  async updateIdeaSubject(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateIdeaSubjectRequestDto,
    @Param('ideaSubjectId') ideaSubjectId: number
  ): Promise<ResponseDto<any>> {
    await this.updateIdeaSubjectUseCase.execute(req.user.id, ideaSubjectId, requestDto);
    return ResponseDto.ok(null);
  }

  /**
   * 3.21 아이디어 주제 삭제
   */
  @Delete('/idea-subjects/:ideaSubjectId')
  @UseGuards(JwtAuthGuard)
  async deleteIdeaSubject(
    @Req() req,
    @Param('ideaSubjectId') ideaSubjectId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteIdeaSubjectUseCase.execute(req.user.id, ideaSubjectId);
    return ResponseDto.ok(null);
  }

  /**
   * 3.25 아이디어 삭제
   */
  @Delete('/ideas/:ideaId')
  @UseGuards(JwtAuthGuard)
  async deleteIdea(
    @Req() req,
    @Param('ideaId') ideaId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteAdminIdeaUseCase.execute(req.user.id, ideaId);
    return ResponseDto.ok(null);
  }
}