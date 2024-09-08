import { Injectable, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UserSemesterRepository } from '../database/repositories/user-semester.repository';
import { UserDto } from './dto/user.dto';
import { UnivRepository } from '../database/repositories/univ.repository';
import { UserSemesterDto } from './dto/user-semester.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersSemesterRepository: UserSemesterRepository,
    private readonly univRepository: UnivRepository,
  ) {}

  async getUserInfo(userId: number) {
    let univ;
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['univ'],
    });
    if (user.univ) {
      univ = user.univ;
    } else {
      univ = null;
    }
    const semesters = await this.usersSemesterRepository.find({
      where: {
        user: user,
      },
    });
    if (univ !== null && semesters !== null) {
      const semestersDtos = semesters.map((semester) => {
        return UserSemesterDto.fromEntity(semester);
      });
      return UserDto.fromEntityWithUnivSemester(user, univ, semestersDtos);
    } else if (univ !== null) {
      return UserDto.fromEntityWithUniv(user, univ);
    } else if (semesters !== null) {
      const semestersDtos = semesters.map((semester) => {
        return UserSemesterDto.fromEntity(semester);
      });
      return UserDto.fromEntityWithSemester(user, semestersDtos);
    } else {
      return UserDto.fromEntity(user);
    }
  }

  async updateUserInfo(userId: number, updateUsersDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      relations: ['univ'],
    });
    // name 필드 처리 (보내지 않으면 null)
    user.name = updateUsersDto.name !== undefined ? updateUsersDto.name : null;

    // githubLink 필드 처리 (보내지 않으면 null)
    user.githubLink =
      updateUsersDto.githubLink !== undefined
        ? updateUsersDto.githubLink
        : null;

    // instagramLink 필드 처리 (보내지 않으면 null)
    user.instagramLink =
      updateUsersDto.instagramLink !== undefined
        ? updateUsersDto.instagramLink
        : null;

    // blogLink 필드 처리 (보내지 않으면 null)
    user.blogLink =
      updateUsersDto.blogLink !== undefined ? updateUsersDto.blogLink : null;

    // univ 필드 처리 (보내지 않으면 null)
    if (updateUsersDto.univName !== undefined) {
      if (updateUsersDto.univName !== null) {
        user.univ = await this.univRepository.findOne({
          where: {
            name: updateUsersDto.univName,
          },
        });
      } else {
        user.univ = null;
      }
    } else {
      user.univ = null;
    }

    await this.userRepository.save(user);
    await this.usersSemesterRepository.delete({
      user: user,
    });
    if (updateUsersDto.semesters === undefined) return;
    for (const semester of updateUsersDto.semesters) {
      await this.usersSemesterRepository.save({
        user: user,
        semester: semester.semester,
        role: semester.role,
      });
    }
  }
}
