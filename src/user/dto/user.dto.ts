import { User } from '../../database/entities/user.entity';
import { Univ } from '../../database/entities/univ.entity';
import { UserSemesterDto } from './user-semester.dto';

export class UserDto {
  readonly id: number;
  readonly name: string;
  readonly univName: string;
  readonly githubLink: string;
  readonly instagramLink: string;
  readonly blogLink: string;
  readonly semester: UserSemesterDto[];

  static fromEntity(user: User) {
    return {
      id: user.id,
      name: user.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
    };
  }

  static fromEntityWithUniv(user: User, univ: Univ): UserDto {
    return {
      id: user.id,
      name: user.name,
      univName: univ.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
      semester: [],
    };
  }

  static fromEntityWithSemester(
    user: User,
    semestersDtos: UserSemesterDto[],
  ): UserDto {
    return {
      id: user.id,
      name: user.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
      univName: null,
      semester: semestersDtos,
    };
  }
  static fromEntityWithUnivSemester(
    user: User,
    univ: Univ,
    semestersDtos: UserSemesterDto[],
  ): UserDto {
    return {
      id: user.id,
      name: user.name,
      univName: univ.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
      semester: semestersDtos,
    };
  }
}
