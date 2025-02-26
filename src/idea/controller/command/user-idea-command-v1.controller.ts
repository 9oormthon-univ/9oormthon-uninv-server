import {
  Body,
  Controller,
  Param, Patch,
  Post, Put,
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
import { UpdateIdeaService } from '../../application/service/update-idea.service';
import { UpdateIdeaRequestDto } from '../../application/dto/request/update-idea.request.dto';
import { AcceptApplyService } from '../../application/service/accept-apply.service';
import { RejectApplyService } from '../../application/service/reject-apply.service';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaUseCase: CreateIdeaService,
    private readonly createApplyUseCase: CreateApplyService,
    private readonly createOrDeleteBookmarkUseCase: CreateOrDeleteBookmarkService,
    private readonly updateIdeaUseCase: UpdateIdeaService,
    private readonly acceptApplyUseCase: AcceptApplyService,
    private readonly rejectApplyUseCase: RejectApplyService,
  ) {}

  /**
   * 3.1 아이디어 생성
   */
  @Post('ideas')
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
  @Post('ideas/:id/applies')
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
  @Post('ideas/:id/bookmarks')
  @UseGuards(JwtAuthGuard)
  async createOrDeleteBookmark(
    @Req() req,
    @Param('id') id: number
  ): Promise<ResponseDto<any>> {
    await this.createOrDeleteBookmarkUseCase.execute(req.user.id, id);
    return ResponseDto.ok(null);
  }

  /**
   * 3.13 아이디어 수정
   */
  @Put('ideas/:id')
  @UseGuards(JwtAuthGuard)
  async updateDefaultInfo(
    @Req() req,
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateIdeaRequestDto
  ): Promise<ResponseDto<any>> {
    await this.updateIdeaUseCase.execute(req.user.id, id, requestDto);
    return ResponseDto.ok(null);
  }

  /**
   * 3.14 지원 수락
   */
  @Patch('applies/:id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptApply(
    @Req() req,
    @Param('id') id: number
  ): Promise<ResponseDto<any>> {
    await this.acceptApplyUseCase.execute(req.user.id, id);
    return ResponseDto.ok(null);
  }

  /**
   * 3.15 지원 거절
   */
  @Patch('applies/:id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectApply(
    @Req() req,
    @Param('id') id: number
  ): Promise<ResponseDto<any>> {
    await this.rejectApplyUseCase.execute(req.user.id, id);
    return ResponseDto.ok(null);
  }
}
