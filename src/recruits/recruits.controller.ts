import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseDto } from '../common/dto/response.dto';
import { RecruitsService } from './recruits.service';

@Controller('/api/v1/recruits')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class RecruitsController {
  constructor(private readonly recruitsService: RecruitsService) {}

  @Get()
  async getLatestRecruit(): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.recruitsService.getLatestRecruit());
  }
}
