import { Controller, Get, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UnivService } from './univ.service';
import { ResponseDto } from '../common/dto/response.dto';

@Controller('/api/v1/univs')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UnivController {
  constructor(private readonly univService: UnivService) {}

  @Get()
  async getAllUnivs(@Query('name') name?: string): Promise<ResponseDto<any>> {
    if (name) {
      return ResponseDto.ok(await this.univService.getAllUnivsByName(name));
    }
    return ResponseDto.ok(await this.univService.getAllUnivs());
  }
}
