import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { RecruitDto } from './dto/recruit.dto';
import { RecruitRepository } from '../database/repositories/recruit.repository';
import { CreateRecruitDto } from './dto/create-recruit.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class RecruitService {
  constructor(private readonly recruitRepository: RecruitRepository) {}
  async getLatestRecruit(): Promise<RecruitDto> {
    const recruit = await this.recruitRepository.findLatestRecruit();
    if (recruit === undefined) {
      throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
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

  async deleteRecruit(id: number): Promise<void> {
    const recruit = await this.recruitRepository.findOne({ where: { id } });
    if (recruit === undefined) {
      throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
    }
    await this.recruitRepository.remove(recruit);
  }

  async updateRecruit(
    id: number,
    createRecruitDto: CreateRecruitDto,
  ): Promise<void> {
    const recruit = await this.recruitRepository.findOne({ where: { id } });
    if (recruit === undefined) {
      throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
    }
    if (createRecruitDto.type !== undefined)
      recruit.type = createRecruitDto.type;
    if (createRecruitDto.title !== undefined)
      recruit.title = createRecruitDto.title;
    if (createRecruitDto.startAt !== undefined)
      recruit.startAt = createRecruitDto.startAt;
    if (createRecruitDto.endAt !== undefined)
      recruit.endAt = createRecruitDto.endAt;
    await this.recruitRepository.save(recruit);
  }
}
