import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { ApplyOverviewDto, ReadMyApplyOverviewResponseDto } from '../dto/response/read-my-apply-overview.response.dto';
import { ERole } from '../../../core/enums/role.enum';
import { TeamRepository } from '../../../team/repository/team.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyApplyOverviewService {
  constructor(
    private readonly applyRepository: ApplyRepository,
    private readonly teamRepository: TeamRepository,
    private readonly dataSource: DataSource
  ) {}
  async execute(userId: number, generation: number, phase: number): Promise<ReadMyApplyOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 유저의 지원 정보 조회
      const userApplies = await this.applyRepository.findByUserIdAndGenerationAndPhase(userId, generation, phase, manager)

      const applyDtoList = userApplies.map(async (apply) => {

        // 지원 정보가 속한 팀 조회
        const team = await this.teamRepository.findWithMembersById(apply.idea.team.id, manager);

        switch (apply.role) {
          case ERole.PM:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRoleAndPhase(apply.idea.id, ERole.PM, phase, manager) / (apply.idea.team.pmCapacity - team.members.filter(member => member.role === ERole.PM).length)).toFixed(2).toString() + ':1');
          case ERole.PD:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRoleAndPhase(apply.idea.id, ERole.PD, phase, manager) / (apply.idea.team.pdCapacity - team.members.filter(member => member.role === ERole.PD).length)).toFixed(2).toString() + ':1');
          case ERole.FE:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRoleAndPhase(apply.idea.id, ERole.FE, phase, manager) / (apply.idea.team.feCapacity - team.members.filter(member => member.role === ERole.FE).length)).toFixed(2).toString() + ':1');
          case ERole.BE:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRoleAndPhase(apply.idea.id, ERole.BE, phase, manager) / (apply.idea.team.beCapacity - team.members.filter(member => member.role === ERole.BE).length)).toFixed(2).toString() + ':1');
        }
      });
      const result = await Promise.all(applyDtoList);
      return ReadMyApplyOverviewResponseDto.of(result.length !== 0 ? result : null);
    });
  }
}