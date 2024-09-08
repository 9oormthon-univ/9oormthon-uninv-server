import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UnivService } from './univ.service';
import { ResponseDto } from '../common/dto/response.dto';
import { CreateUnivDto } from './dto/create-univ.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';

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

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 1024 * 1024 * 20,
      },
      storage: multer.memoryStorage(),
    }),
  )
  async createUniv(
    @Body(new ValidationPipe({ transform: true })) createUnivDto: CreateUnivDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    await this.univService.createUniv(createUnivDto, file);
    return ResponseDto.created(null);
  }
  @Delete('/:id')
  async deleteUniv(@Param('id') id: number): Promise<ResponseDto<any>> {
    await this.univService.deleteUniv(id);
    return ResponseDto.ok(null);
  }
}
