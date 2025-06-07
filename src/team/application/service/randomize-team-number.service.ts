import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UserRepository } from '../../../user/repository/user.repository';
import { TeamRepository } from '../../repository/team.repository';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class RandomizeTeamNumberService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(adminId: number, generation: number) {
    return this.dataSource.transaction(async (manager) => {
      // 어드민 조회
      const admin = await this.userRepository.findById(adminId, manager);
      if (!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      // 팀 조회
      const teams = await this.teamRepository.findAllByGeneration(generation, manager);
      if (!teams || teams.length === 0) {
        throw new CommonException(ErrorCode.NOT_FOUND_TEAM);
      }

      // 1번부터 팀 개수 까지의 숫자가 들어간 배열 생성
      const numbers = Array.from({ length: teams.length }, (_, i) => i + 1);

      // Fisher–Yates shuffle로 랜덤 셔플
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
      }

      // 셔플된 번호를 팀에 하나씩 할당
      const randomizedTeams = teams.map((team, idx) => team.updateNumber(numbers[idx]));

      await this.teamRepository.saveAll(randomizedTeams, manager);
    });
  }
}