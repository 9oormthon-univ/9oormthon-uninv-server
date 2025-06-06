import { Controller, Get, Req, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ResponseInterceptor } from '../../../core/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { ReadSystemSettingDetailService } from '../../application/service/read-system-setting-detail.service';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { ResponseDto } from '../../../core/dto/response.dto';

@Controller('/api/v1/admins/system-settings')
@UseInterceptors(ResponseInterceptor)
@UseFilters(HttpExceptionFilter)
export class AdminSystemSettingQueryV1Controller {
  constructor(
    private readonly readSystemSettingDetailUseCase: ReadSystemSettingDetailService
  ) {}

  /**
   * 4.2 어드민 시스템 설정 상세 조회
   */
  @Get('details')
  @UseGuards(JwtAuthGuard)
  async getSystemSettingDetail(
    @Req() req: any, // Assuming req is of type Request
  ): Promise<ResponseDto<any>> {
    return ResponseDto.ok(await this.readSystemSettingDetailUseCase.execute(req.user.id));
  }

}