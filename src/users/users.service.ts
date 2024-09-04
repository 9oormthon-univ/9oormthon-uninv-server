import { Injectable, Req } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UsersSemestersRepository } from '../database/repositories/users-semesters.repository';
import { UsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersSemesterRepository: UsersSemestersRepository,
  ) {}
  async getUserInfo(@Req() req) {
    let univ;
    const user = await this.userRepository.findOne({
      where: {
        id: req.user.id,
      },
      relations: ['univ'],
    });
    if (user.univ) {
      univ = user.univ;
    } else {
      univ = null;
    }
    const semester = await this.usersSemesterRepository.find({
      where: {
        user: user,
      },
    });
    if (univ !== null && semester !== null) {
      return UsersDto.fromEntityWithUnivSemester(user, univ, semester);
    } else if (univ !== null) {
      return UsersDto.fromEntityWithUniv(user, univ);
    } else if (semester !== null) {
      return UsersDto.fromEntityWithSemester(user, semester);
    } else {
      return UsersDto.fromEntity(user);
    }
  }
}
