import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UnivRepository } from '../../repository/univ.repository';
import { DataSource } from 'typeorm';
import { CreateUnivRequestDto } from '../dto/request/create-univ.request.dto';
import { UnivModel } from '../../domain/univ.model';
import { UserRepository } from '../../repository/user.repository';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class CreateUnivService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly univRepository: UnivRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute (userId: number, requestDto: CreateUnivRequestDto) {

    return this.dataSource.transaction(async (manager) => {

      // 어드민 조회
      const admin = await this.userRepository.findById(userId, manager);
      if(!admin) {
        throw new CommonException(ErrorCode.NOT_FOUND_USER);
      }

      // 어드민 권한 검증
      admin.validateAdminRole();

      const univ = UnivModel.createUniv(
        requestDto.name,
        requestDto.instagramUrl,
        requestDto.generation
      );

      await this.univRepository.save(univ, manager);
    });
  }
}