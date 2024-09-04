import { UsersSemesters } from '../../database/entities/users-semesters';
import { User } from '../../database/entities/user.entity';
import { Univ } from '../../database/entities/univ.entity';

export class UsersDto {
  readonly id: number;
  readonly name: string;
  readonly univName: string;
  readonly githubLink: string;
  readonly instagramLink: string;
  readonly blogLink: string;
  readonly semester: UsersSemesters[];

  static fromEntity(user: User) {
    return {
      id: user.id,
      name: user.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
    };
  }

  static fromEntityWithUniv(user: User, univ: Univ): UsersDto {
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
    semester: UsersSemesters[],
  ): UsersDto {
    return {
      id: user.id,
      name: user.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
      univName: null,
      semester: semester,
    };
  }
  static fromEntityWithUnivSemester(
    user: User,
    univ: Univ,
    semester: UsersSemesters[],
  ): UsersDto {
    return {
      id: user.id,
      name: user.name,
      univName: univ.name,
      githubLink: user.githubLink,
      instagramLink: user.instagramLink,
      blogLink: user.blogLink,
      semester: semester,
    };
  }
}
