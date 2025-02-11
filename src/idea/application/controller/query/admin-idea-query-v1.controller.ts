import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';

@Controller('/api/v1/admins/ideas')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminIdeaQueryV1Controller {

}