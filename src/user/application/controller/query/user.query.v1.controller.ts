import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { UpdateUserUseCase } from '../../usecase/update-user.service';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../../core/dto/response.dto';
import { UpdateUserRequestDto } from '../../dto/request/update-user.request.dto';
import { ReadUserDetailUseCase } from '../../usecase/read-user-detail.usecase';
import { ReadUserDetailService } from '../../service/read-user-detail.service';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserQueryV1Controller {
  constructor(
    private readonly readUserDetailUseCase: ReadUserDetailService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readUserDetailUseCase.execute(req.user.id));
  }
}