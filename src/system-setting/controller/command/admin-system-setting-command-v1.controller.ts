import {
  Body,
  Controller,
  Patch,
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
import { UpdateSystemSettingRequestDto } from '../../application/dto/request/update-system-setting.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { UpdateSystemSettingService } from '../../application/service/update-system-setting.service';
import { UpdateMaxIdeaNumberService } from '../../application/service/update-max-idea-number.service';
import { UpdateMaxIdeaNumberRequestDto } from '../../application/dto/request/update-max-idea-number.request.dto';

@Controller('/api/v1/admins/system-settings')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminSystemSettingCommandV1Controller {
  constructor(
    private readonly updateSystemSettingUseCase: UpdateSystemSettingService,
    private readonly updateMaxIdeaNumberUseCase: UpdateMaxIdeaNumberService
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateSystemSetting(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateSystemSettingRequestDto
  ): Promise<ResponseDto<any>> {
    await this.updateSystemSettingUseCase.execute(req.user.userId, requestDto);
    return ResponseDto.ok(null);
  }

  @Patch('max-idea-number')
  @UseGuards(JwtAuthGuard)
  async updateMaxIdeaNumber(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateMaxIdeaNumberRequestDto
  ): Promise<ResponseDto<any>> {
    await this.updateMaxIdeaNumberUseCase.execute(req.user.userId, requestDto);
    return ResponseDto.ok(null);
  }
}