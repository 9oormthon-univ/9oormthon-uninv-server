import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { CreateUnivRequestDto } from '../dto/request/create-univ.request.dto';
import { UnivModel } from '../../domain/univ.model';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateUnivService {
  constructor(
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute (requestDto: CreateUnivRequestDto) {

    return this.dataSource.transaction(async (manager) => {
      const univ = UnivModel.createUniv(
        requestDto.name,
        requestDto.instagram_url,
        requestDto.generation
      );

      await this.univRepository.save(univ, manager);
    });
  }
}