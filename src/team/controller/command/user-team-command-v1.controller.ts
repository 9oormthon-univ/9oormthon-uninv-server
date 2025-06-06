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
import { UpdateTeamStatusService } from '../../application/service/update-team-status.service';
import { UpdateTeamStatusQueryDto } from '../../application/dto/request/update-team-status.query.dto';

@Controller('/api/v1/users/teams')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class UserTeamCommandV1Controller {
  constructor(
    private readonly updateTeamUseCase: UpdateTeamService,
    private readonly updateTeamStatusUseCase: UpdateTeamStatusService
  ) {}

  /**
   * 4.9 팀 정보 수정
   */
  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateTeam(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: UpdateTeamRequestDto
  ) :Promise<ResponseDto<any>> {
    await this.updateTeamUseCase.execute(req.user.id, requestDto);
    return ResponseDto.ok(null);
  }

  /**
   * 4.10 팀 상태 수정
   */
  @Patch('/status')
  @UseGuards(JwtAuthGuard)
  async updateTeamStatus(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) query: UpdateTeamStatusQueryDto
  ): Promise<ResponseDto<any>> {
    await this.updateTeamStatusUseCase.execute(req.user.id, query.generation);
    return ResponseDto.ok(null);
  }
}