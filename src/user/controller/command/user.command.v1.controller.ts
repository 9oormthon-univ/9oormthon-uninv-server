import {
  Body,
  Controller,
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
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { UpdateUserRequestDto } from '../../application/dto/request/update-user.request.dto';
import { UpdateUserService } from '../../application/service/update-user.service';
import { CreateUnivRequestDto } from '../../application/dto/request/create-univ.request.dto';
import { CreateUnivService } from '../../application/service/create-univ-service';

@Controller('/api/v1')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserCommandV1Controller {
  constructor(
    private readonly updateUserUseCase: UpdateUserService,
    private readonly createUnivUseCase: CreateUnivService
  ) {}

  @Put('users')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body(new ValidationPipe({ transform: true })) updateUsersDto: UpdateUserRequestDto): Promise<ResponseDto<any>> {
    await this.updateUserUseCase.execute(req.user.id, updateUsersDto);
    return ResponseDto.ok(null);
  }

  @Post('admins/univs')
  @UseGuards(JwtAuthGuard)
  async createUniv(@Req() req, @Body(new ValidationPipe({ transform: true })) createUnivDto: CreateUnivRequestDto): Promise<ResponseDto<any>> {
    await this.createUnivUseCase.execute(req.user.userId, createUnivDto);
    return ResponseDto.created(null);
  }
}