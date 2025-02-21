import { Injectable, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../core/filters/http-exception.filter';
import { UpdateUserRequestDto } from '../dto/request/update-user.request.dto';
import { UserModel } from '../../domain/user.model';
import { DataSource } from 'typeorm';
import { CommonException } from '../../../core/exceptions/common.exception';
import { ErrorCode } from '../../../core/exceptions/error-code';
import { UserRepository } from '../../repository/user.repository';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UpdateUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly dataSource: DataSource
  ) {}

  async execute(userId: number, requestDto:UpdateUserRequestDto) {
    return this.dataSource.transaction(async (manager) => {
      const user : UserModel = await this.userRepository.findByIdWithUniv(userId, manager);

      if(user === null) {
        throw new CommonException(ErrorCode.NOT_FOUND_RESOURCE);
      }

      const updatedUser = user.updateUser(
        requestDto.introduction,
        requestDto.stacks,
        requestDto.links
      );
      await this.userRepository.save(updatedUser, manager);
    });
  }
}
