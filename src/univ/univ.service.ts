import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { UnivRepository } from '../database/repositories/univ.repository';
import { Univ } from '../database/entities/univ.entity';
import { CommonException } from '../common/exceptions/common.exception';
import { ErrorCode } from '../common/exceptions/error-code';
import { UnivDto } from './dto/univ.dto';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UnivService {
  constructor(private readonly univRepository: UnivRepository) {}

  async getAllUnivs(): Promise<UnivDto[]> {
    const univs: Univ[] = await this.univRepository.findAll();
    if (univs === undefined || univs.length === 0) {
      throw new CommonException(ErrorCode.NOT_FOUND_UNIV);
    }
    return univs.map((univ) => UnivDto.fromEntity(univ));
  }
}
