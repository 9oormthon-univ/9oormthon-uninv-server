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
import { UserService } from './user.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/api/v1/user')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserController {
  constructor(private readonly usersService: UserService) {}

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
    updateUsersDto: UpdateUserDto,
  ): Promise<ResponseDto<any>> {
    const userId = req.user.id;
    return ResponseDto.ok(
      await this.usersService.updateUserInfo(userId, updateUsersDto),
    );
  }
}
