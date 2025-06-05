import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { CreateTeamRequestDto } from '../../application/dto/request/create-team.request.dto';
import { ResponseDto } from '../../../core/dto/response.dto';
import { CreateMemberRequestDto } from '../../application/dto/request/create-member.request.dto';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { CreateTeamService } from '../../application/service/create-team.service';
import { CreateMemberService } from '../../application/service/create-member.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminTeamCommandV1Controller {
  constructor(
    private readonly createTeamUseCase: CreateTeamService,
    private readonly createMemberUseCase: CreateMemberService,
  ) {}

  /**
   * 4.1 어드민 팀 추가
   */
  @Post('/teams')
  @UseGuards(JwtAuthGuard)
  async createTeam(
    @Req() req,
    @Body(new ValidationPipe({ transform: true })) requestDto: CreateTeamRequestDto,
  ): Promise<ResponseDto<any>> {
    await this.createTeamUseCase.execute(req.user.id, requestDto);
    return ResponseDto.created(null);
  }

  /**
   * 4.2 어드민 특정 팀에 멤버 추가
   */
  @Post('/teams/:teamId(\\d+)/members')
  @UseGuards(JwtAuthGuard)
  async createMember(
    @Req() req,
    @Param('teamId') teamId: number,
    @Body(new ValidationPipe({ transform: true })) requestDto: CreateMemberRequestDto,
  ): Promise<ResponseDto<any>> {
    await this.createMemberUseCase.execute(req.user.id, teamId, requestDto);
    return ResponseDto.created(null);
  }
}