import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ReadIdeaOverviewResponseDto } from '../dto/response/read-idea-overview.response.dto';
import { IdeaRepository } from '../../repository/idea.repository';
import { PageInfoDto } from '../../../core/dto/page-info.dto';
import { SystemSettingRepository } from '../../../system-setting/repository/system-setting.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { EPeriod } from '../../../core/enums/period.enum';
import { UserRepository } from '../../../user/repository/user.repository';
import { ReadAdminIdeaOverviewResponseDto } from '../dto/response/read-admin-idea-overview.response.dto';
import { ReadAdminIdeaOverviewQueryDto } from '../dto/request/read-admin-idea-overview.query.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadAdminIdeaOverviewService {
  constructor(
    private readonly ideaRepository: IdeaRepository,
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(
    adminId: number,
    requestDto: ReadAdminIdeaOverviewQueryDto
  ): Promise<ReadAdminIdeaOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 아이디어 조회
      const { ideas, totalItems } = await this.ideaRepository.findAdminIdeaOverview(
        requestDto.page,
        requestDto.size,
        requestDto.generation,
        requestDto.sorting,
        requestDto.sortType,
        requestDto.search,
        manager
      );

      const totalPages = Math.ceil(totalItems / requestDto.size);

      const pageInfoDto = PageInfoDto.of(requestDto.page, requestDto.size, totalPages, totalItems);

      return ReadAdminIdeaOverviewResponseDto.of(ideas,pageInfoDto);
    });
  }
}