import {
  Body,
  Controller, Delete,
  Param, Patch,
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
import { UpdateMemberIsLeaderService } from '../../application/service/update-member-is-leader.service';
import { DeleteTeamService } from '../../application/service/delete-team.service';
import { DeleteMemberService } from '../../application/service/delete-member.service';

@Controller('/api/v1/admins')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminTeamCommandV1Controller {
  constructor(
    private readonly createTeamUseCase: CreateTeamService,
    private readonly createMemberUseCase: CreateMemberService,
    private readonly updateMemberIsLeaderUseCase: UpdateMemberIsLeaderService,
    private readonly deleteTeamUseCase: DeleteTeamService,
    private readonly deleteMemberUseCase: DeleteMemberService
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

  /**
   * 4.8 어드민 팀원 팀장 임명
   */
  @Patch('members/:memberId(\\d+)/is-leader')
  @UseGuards(JwtAuthGuard)
  async updateMemberIsLeader(
    @Req() req,
    @Param('memberId') memberId: number,
  ): Promise<ResponseDto<any>> {
    await this.updateMemberIsLeaderUseCase.execute(req.user.id, memberId);
    return ResponseDto.ok(null);
  }

  /**
   * 4.10 어드민 팀 해체
   */
  @Delete('/teams/:teamId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteTeam(
    @Req() req,
    @Param('teamId') teamId: number,
  ): Promise<ResponseDto<any>> {
    await this.deleteTeamUseCase.execute(req.user.id, teamId);
    return ResponseDto.ok(null);
  }

  /**
   * 4.11 어드민 팀원 방출
   */
  @Delete('/members/:memberId(\\d+)')
  @UseGuards(JwtAuthGuard)
  async deleteMember(
    @Req() req,
    @Param('memberId') memberId: number,
  ): Promise<ResponseDto<any>> {
    await this.deleteMemberUseCase.execute(req.user.id, memberId);
    return ResponseDto.ok(null);
  }
}
