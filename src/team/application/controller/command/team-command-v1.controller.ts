import { Controller, Get, UseFilters, UseInterceptors } from '@nestjs/common';
import { ProjectEntity } from '../../../../core/infra/entities/project.entity';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';

@Controller('/api/v1/teams')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class TeamCommandV1Controller {
}