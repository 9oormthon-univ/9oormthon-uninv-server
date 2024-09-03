import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { RecruitDto } from './dto/recruit.dto';
import { RecruitRepository } from '../database/repositories/recruit.repository';
import { CreateRecruitDto } from './dto/create-recruit.dto';
import { Recruit } from '../database/entities/recruit.entity';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class RecruitsService {
  constructor(private readonly recruitRepository: RecruitRepository) {}
  async getLatestRecruit(): Promise<RecruitDto> {
    const recruit = await this.recruitRepository.findLatestRecruit();
    if (recruit === undefined) {
      throw new CommonException(ErrorCode.NOT_FOUND_RECRUIT);
    }
    return RecruitDto.fromEntity(recruit);
  }

  async createRecruit(createRecruitDto: CreateRecruitDto): Promise<void> {
    const recruit = await this.recruitRepository.create({
      type: createRecruitDto.type,
      title: createRecruitDto.title,
      startAt: createRecruitDto.startAt,
      endAt: createRecruitDto.endAt,
    });
    await this.recruitRepository.save(recruit);
  }
}
