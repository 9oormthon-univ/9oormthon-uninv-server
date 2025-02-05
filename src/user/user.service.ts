import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UserDto } from './dto/user.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async readUserDetail(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['univ'],
    });
    return UserDto.of(user);
  }

  async updateUserInfo(userId: number, updateUsersDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    // introduction 필드 처리 (보내지 않으면 null)
    user.introduction =
      updateUsersDto.introduction !== undefined
        ? updateUsersDto.introduction
        : null;

    // stacks 필드 처리 (보내지 않으면 null)
    user.stacks =
      updateUsersDto.stacks !== undefined ? updateUsersDto.stacks : null;

    // links 필드 처리 (보내지 않으면 null)
    user.links =
      updateUsersDto.githubLink !== undefined
        ? updateUsersDto.githubLink
        : null;

    await this.userRepository.save(user);
  }
}
