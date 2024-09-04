import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { ResponseDto } from '../common/dto/response.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUsersDto } from './dto/update-users.dto';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() req): Promise<ResponseDto<any>> {
    const userId = req.user.id;
    return ResponseDto.ok(await this.usersService.getUserInfo(userId));
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUserInfo(
    @Req() req,
    @Body(new ValidationPipe({ transform: true }))
    updateUsersDto: UpdateUsersDto,
  ): Promise<ResponseDto<any>> {
    const userId = req.user.id;
    return ResponseDto.ok(
      await this.usersService.updateUserInfo(userId, updateUsersDto),
    );
  }
}
