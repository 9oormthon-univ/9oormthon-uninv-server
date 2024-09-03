import {
  Body,
  Controller,
  Get,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseDto } from '../common/dto/response.dto';
import { RecruitsService } from './recruits.service';
import { CreateRecruitDto } from './dto/create-recruit.dto';

@Controller('/api/v1/recruits')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class RecruitsController {
  constructor(private readonly recruitsService: RecruitsService) {}

  @Get()
  async getLatestRecruit(): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.recruitsService.getLatestRecruit());
  }

  @Post()
  async createRecruit(
    @Body(new ValidationPipe({ transform: true }))
    createRecruitDto: CreateRecruitDto,
  ): Promise<ResponseDto<any>> {
    return ResponseDto.created(
      await this.recruitsService.createRecruit(createRecruitDto),
    );
  }
}
