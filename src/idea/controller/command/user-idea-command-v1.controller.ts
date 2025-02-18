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
import { CreateIdeaService } from '../../application/service/create-idea.service';
import { CreateIdeaRequestDto } from '../../application/dto/request/create-idea.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CreateApplyService } from '../../application/service/create-apply.service';
import { CreateApplyRequestDto } from '../../application/dto/request/create-apply.request.dto';
import { CreateOrDeleteBookmarkService } from '../../application/service/create-or-delete-bookmark.service';

@Controller('/api/v1/users/ideas')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaUseCase: CreateIdeaService,
    private readonly createApplyUseCase: CreateApplyService,
    private readonly createOrDeleteBookmarkUseCase: CreateOrDeleteBookmarkService,
  ) {}

  /**
   * 3.1 아이디어 생성
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createIdea(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: CreateIdeaRequestDto
  ): Promise<ResponseDto<any>> {
    await this.createIdeaUseCase.execute(req.user.id, requestDto);
    return ResponseDto.created(null);
  }

  /**
   * 3.4 아이디어 지원
   */
  @Post(':id/applies')
  @UseGuards(JwtAuthGuard)
  async createApply(
    @Req() req,
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) requestDto: CreateApplyRequestDto,
  ): Promise<ResponseDto<any>> {
    await this.createApplyUseCase.execute(req.user.id, id, requestDto);
    return ResponseDto.created(null);
  }

  /**
   * 3.5 북마크 토글(생성 or 삭제)
   */
  @Post(':id/bookmarks')
  @UseGuards(JwtAuthGuard)
  async createOrDeleteBookmark(
    @Req() req,
    @Param('id') id: number
  ): Promise<ResponseDto<any>> {
    await this.createOrDeleteBookmarkUseCase.execute(req.user.id, id);
    return ResponseDto.ok(null);
  }
}
