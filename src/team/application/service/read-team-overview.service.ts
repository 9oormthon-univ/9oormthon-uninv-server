import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { UserRepository } from '../../../user/repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { PageInfoDto } from '../../../core/dto/page-info.dto';
import { ReadTeamOverviewResponseDto } from '../dto/response/read-team-overview.response.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadTeamOverviewService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource,
  ) {}

  async execute(adminId: number, page: number, size: number, generation: number, sorting: string, sortType: string, search: string) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 팀 조회
      const { teams, totalItems } = await this.teamRepository.findTeamOverview(
        page,
        size,
        generation,
        sorting,
        sortType,
        search,
        manager
      );

      const totalPages = Math.ceil(totalItems / size);

      const pageInfoDto = PageInfoDto.of(page, size, totalPages, totalItems);

      return ReadTeamOverviewResponseDto.of(teams, pageInfoDto);
    });
  }
}