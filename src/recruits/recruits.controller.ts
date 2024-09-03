import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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

  @Delete('/:id')
  async deleteRecruit(@Param('id') id: number): Promise<ResponseDto<any>> {
    await this.recruitsService.deleteRecruit(id);
    return ResponseDto.ok(null);
  }

  @Patch('/:id')
  async updateRecruit(
    @Param('id') id: number,
    @Body(new ValidationPipe({ transform: true }))
    createRecruitDto: CreateRecruitDto,
  ): Promise<ResponseDto<any>> {
    await this.recruitsService.updateRecruit(id, createRecruitDto);
    return ResponseDto.ok(null);
  }
}
