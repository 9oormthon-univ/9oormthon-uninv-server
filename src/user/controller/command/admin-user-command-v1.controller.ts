import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req, UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';
import { CreateUnivRequestDto } from '../../application/dto/request/create-univ.request.dto';
import { CreateUnivService } from '../../application/service/create-univ-service';
import { UpdateUnivService } from '../../application/service/update-univ.service';
import { UpdateUnivRequestDto } from '../../application/dto/request/update-univ.request.dto';
import { DeleteUnivService } from '../../application/service/delete-univ.service';
import { UpdateAdminUserService } from '../../application/service/update-admin-user-service';
import { UpdateAdminUserRequestDto } from '../../application/dto/request/update-admin-user.request.dto';
import { DeleteUserService } from '../../application/service/delete-user.service';
import { CreateUserService } from '../../application/service/create-user.service';
import { CreateUserRequestDto } from '../../application/dto/request/create-user.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateUserByExcelService } from '../../application/service/create-user-by-excel.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminUserCommandV1Controller {
  constructor(
    private readonly createUserUseCase: CreateUserService,
    private readonly createUserByExcelUseCase: CreateUserByExcelService,
    private readonly updateAdminUserUseCase: UpdateAdminUserService,
    private readonly deleteUserUseCase: DeleteUserService,
    private readonly createUnivUseCase: CreateUnivService,
    private readonly updateUnivUseCase: UpdateUnivService,
    private readonly deleteUnivUseCase: DeleteUnivService,
  ) {}

  /**
   * 2.1 어드민 유저 생성
   */
  @Post('users')
  @UseGuards(JwtAuthGuard)
  async createUser(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) createUserDto: CreateUserRequestDto,
  ): Promise<ResponseDto<any>> {
    await this.createUserUseCase.execute(req.user.userId, createUserDto);
    return ResponseDto.created(null);
  }

  /**
   * 2.2 어드민 유저 엑셀로 생성
   */
  @Post('/users/excel')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  async signUp(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    await this.createUserByExcelUseCase.execute(req.user.id, file);
    return ResponseDto.created(null);
  }

  /**
   * 2.9 어드민 유저 정보 수정
   */
  @Put('users/:userId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async updateAdminUser(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) updateAdminUserDto: UpdateAdminUserRequestDto,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    await this.updateAdminUserUseCase.execute(req.user.userId, userId, updateAdminUserDto);
    return ResponseDto.ok(null);
  }

  /**
   * 2.10 어드민 유저 삭제
   */
  @Delete('users/:userId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteUserUseCase.execute(req.user.userId, userId);
    return ResponseDto.ok(null);
  }

  /**
   * 6.1 어드민 유니브 생성
   */
  @Post('univs')
  @UseGuards(JwtAuthGuard)
  async createUniv(@Req() req, @Body(new ValidationPipe({ transform: true })) createUnivDto: CreateUnivRequestDto): Promise<ResponseDto<any>> {
    await this.createUnivUseCase.execute(req.user.userId, createUnivDto);
    return ResponseDto.created(null);
  }

  /**
   * 6.4 어드민 유니브 수정
   */
  @Put('univs/:univId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async updateUniv(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) updateUnivDto: UpdateUnivRequestDto,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    await this.updateUnivUseCase.execute(req.user.userId, univId, updateUnivDto);
    return ResponseDto.ok(null);
  }

  /**
   * 6.5 어드민 유니브 삭제
   */
  @Delete('univs/:univId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteUniv(
    @Req() req,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteUnivUseCase.execute(req.user.userId, univId);
    return ResponseDto.ok(null);
  }
}