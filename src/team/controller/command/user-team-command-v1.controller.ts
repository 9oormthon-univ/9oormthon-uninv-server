import {
  Body,
  Controller,
  Patch,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UpdateTeamService } from '../../application/service/update-team.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { UpdateTeamRequestDto } from '../../application/dto/request/update-team.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';

@Controller('/api/v1/users/teams')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserTeamCommandV1Controller {
  constructor(
    private readonly updateTeamUseCase: UpdateTeamService
  ) {}

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateTeam(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateTeamRequestDto
  ) :Promise<ResponseDto<any>> {
    await this.updateTeamUseCase.execute(req.user.id, requestDto);
    return ResponseDto.ok(null);
  }
}