import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { RecruitDto } from './dto/recruit.dto';
import { RecruitRepository } from '../database/repositories/recruit.repository';

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
}
