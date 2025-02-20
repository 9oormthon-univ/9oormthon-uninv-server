import { Controller, Get, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadCurrentPeriodService } from '../../application/service/read-current-period.service';
import { ResponseDto } from '../../../core/dto/response.dto';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';

@Controller('/api/v1/system-settings')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class SystemSettingQueryV1Controller {
  constructor(
    private readonly readCurrentPeriodUseCase: ReadCurrentPeriodService,
  ) {}

  @Get('current-period')
  @UseGuards(JwtAuthGuard)
  async readCurrentPeriod(): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readCurrentPeriodUseCase.execute());
  }
}