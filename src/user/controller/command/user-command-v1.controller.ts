import {
  Body,
  Controller, Delete, Param,
  Post,
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
import { ResponseDto } from '../../../core/dto/response.dto';
import { UpdateUserRequestDto } from '../../application/dto/request/update-user.request.dto';
import { UpdateUserService } from '../../application/service/update-user.service';
import { CreateUnivRequestDto } from '../../application/dto/request/create-univ.request.dto';
import { CreateUnivService } from '../../application/service/create-univ-service';
import { UpdateUnivService } from '../../application/service/update-univ.service';
import { UpdateUnivRequestDto } from '../../application/dto/request/update-univ.request.dto';
import { DeleteUnivService } from '../../application/service/delete-univ.service';
import { UpdateAdminUserService } from '../../application/service/update-admin-user-service';
import { UpdateAdminUserRequestDto } from '../../application/dto/request/update-admin-user.request.dto';
import { DeleteUserService } from '../../application/service/delete-user.service';

@Controller('/api/v1')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserCommandV1Controller {
  constructor(
    private readonly updateUserUseCase: UpdateUserService,
    private readonly updateAdminUserUseCase: UpdateAdminUserService,
    private readonly deleteUserUseCase: DeleteUserService,
    private readonly createUnivUseCase: CreateUnivService,
    private readonly updateUnivUseCase: UpdateUnivService,
    private readonly deleteUnivUseCase: DeleteUnivService,
  ) {}

  @Put('users')
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body(new ValidationPipe({ transform: true })) updateUsersDto: UpdateUserRequestDto): Promise<ResponseDto<any>> {
    await this.updateUserUseCase.execute(req.user.id, updateUsersDto);
    return ResponseDto.ok(null);
  }

  @Put('admins/users/:userId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async updateAdminUser(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) updateAdminUserDto: UpdateAdminUserRequestDto,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    await this.updateAdminUserUseCase.execute(req.user.userId, userId, updateAdminUserDto);
    return ResponseDto.ok(null);
  }

  @Delete('admins/users/:userId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteUser(
    @Req() req,
    @Param('userId') userId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteUserUseCase.execute(req.user.userId, userId);
    return ResponseDto.ok(null);
  }


  @Post('admins/univs')
  @UseGuards(JwtAuthGuard)
  async createUniv(@Req() req, @Body(new ValidationPipe({ transform: true })) createUnivDto: CreateUnivRequestDto): Promise<ResponseDto<any>> {
    await this.createUnivUseCase.execute(req.user.userId, createUnivDto);
    return ResponseDto.created(null);
  }

  @Put('admins/univs/:univId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async updateUniv(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) updateUnivDto: UpdateUnivRequestDto,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    await this.updateUnivUseCase.execute(req.user.userId, univId, updateUnivDto);
    return ResponseDto.ok(null);
  }

  @Delete('admins/univs/:univId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteUniv(
    @Req() req,
    @Param('univId') univId: number
  ): Promise<ResponseDto<any>> {
    await this.deleteUnivUseCase.execute(req.user.userId, univId);
    return ResponseDto.ok(null);
  }



}