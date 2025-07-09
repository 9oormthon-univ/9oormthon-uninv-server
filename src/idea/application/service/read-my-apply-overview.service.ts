import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { DataSource } from 'typeorm';
import { ApplyRepository } from '../../repository/apply.repository';
import { ApplyOverviewDto, ReadMyApplyOverviewResponseDto } from '../dto/response/read-my-apply-overview.response.dto';
import { ERole } from '../../../core/enums/role.enum';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class ReadMyApplyOverviewService {
  constructor(
    private readonly applyRepository: ApplyRepository,
    private readonly dataSource: DataSource
  ) {}
  async execute(userId: number, generation: number, phase: number): Promise<ReadMyApplyOverviewResponseDto> {
    return this.dataSource.transaction(async (manager) => {
      // 유저의 지원 정보 조회
      const applies = await this.applyRepository.findByUserIdAndGenerationAndPhase(userId, generation, phase, manager);
      const applyDtoList = applies.map(async (apply) => {
        switch (apply.role) {
          case ERole.PM:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRole(apply.idea.id, ERole.PM, manager) / apply.idea.team.pmCapacity - apply.idea.team.members.filter(member => member.role === ERole.PM).length).toFixed(2).toString() + ':1');
          case ERole.PD:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRole(apply.idea.id, ERole.PD, manager) / apply.idea.team.pdCapacity - apply.idea.team.members.filter(member => member.role === ERole.PD).length).toFixed(2).toString() + ':1');
          case ERole.FE:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRole(apply.idea.id, ERole.FE, manager) / apply.idea.team.feCapacity - apply.idea.team.members.filter(member => member.role === ERole.FE).length).toFixed(2).toString() + ':1');
          case ERole.BE:
            return ApplyOverviewDto.of(apply, (await this.applyRepository.countByIdeaIdAndRole(apply.idea.id, ERole.BE, manager) / apply.idea.team.beCapacity - apply.idea.team.members.filter(member => member.role === ERole.BE).length).toFixed(2).toString() + ':1');
        }
      });
      const result = await Promise.all(applyDtoList);
      return ReadMyApplyOverviewResponseDto.of(result.length !== 0 ? result : null);
    });
  }
}