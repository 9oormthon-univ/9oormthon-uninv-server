import { Body, Controller, Put, Req, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '../../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../../core/filters/http-exception.filter';
import { UpdateUserUseCase } from '../../usecase/update-user.service';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../../core/dto/response.dto';
import { UpdateUserRequestDto } from '../../dto/request/update-user.request.dto';
import { UpdateUserService } from '../../service/update-user.service';

@Controller('/api/v1/users')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserCommandV1Controller {
  constructor(
    private readonly updateUserUseCase: UpdateUserService,
  ) {}

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUser(@Req() req, @Body(new ValidationPipe({ transform: true })) updateUsersDto: UpdateUserRequestDto): Promise<ResponseDto<any>> {
    return ResponseDto.ok(
      await this.updateUserUseCase.execute(req.user.id, updateUsersDto),
    );
  }
}