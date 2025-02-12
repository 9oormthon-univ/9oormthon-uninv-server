import { Body, Controller, Post, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { CreateIdeaService } from '../../service/create-idea.service';
import { CreateIdeaRequestDto } from '../../dto/request/create-idea.request.dto';
import { ResponseDto } from '../../../../core/dto/response.dto';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';

@Controller('/api/v1/users/ideas')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserIdeaCommandV1Controller {
  constructor(
    private readonly createIdeaUseCase: CreateIdeaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createIdea(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: CreateIdeaRequestDto
  ): Promise<ResponseDto<any>> {
    await this.createIdeaUseCase.execute(req.user.id, requestDto);
    return ResponseDto.created(null);
  }
}
