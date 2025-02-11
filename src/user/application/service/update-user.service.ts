import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../../repository/user.repository';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UpdateUserUseCase } from '../usecase/update-user.service';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserModel } from '../../domain/user.model';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepositoryImpl } from '../../repository/user.repository.impl';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateUserService implements UpdateUserUseCase{
  constructor(
    private readonly userRepository: UserRepositoryImpl,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto:UpdateUserRequestDto) {
    return this.dataSource.transaction(async (manager) => {
      const user : UserModel = await this.userRepository.findByIdWithUniv(userId, manager);

      if(user === null) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      user.updateUser(
        requestDto.introduction,
        requestDto.stacks,
        requestDto.links
      );
      await this.userRepository.save(user);
    });
  }
}
