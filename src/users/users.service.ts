import { Injectable, Req, UseFilters } from '@nestjs/common';
import { UserRepository } from '../database/repositories/user.repository';
import { UsersSemestersRepository } from '../database/repositories/users-semesters.repository';
import { UsersDto } from './dto/users.dto';
import { UnivRepository } from '../database/repositories/univ.repository';
import { UsersSemestersDto } from './dto/users-semesters.dto';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@Injectable()
@UseFilters(HttpExceptionFilter)
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly usersSemesterRepository: UsersSemestersRepository,
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
        return UsersSemestersDto.fromEntity(semester);
      });
      return UsersDto.fromEntityWithUnivSemester(user, univ, semestersDtos);
    } else if (univ !== null) {
      return UsersDto.fromEntityWithUniv(user, univ);
    } else if (semesters !== null) {
      const semestersDtos = semesters.map((semester) => {
        return UsersSemestersDto.fromEntity(semester);
      });
      return UsersDto.fromEntityWithSemester(user, semestersDtos);
    } else {
      return UsersDto.fromEntity(user);
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
