import { User } from '../../database/entities/user.entity';
import { Univ } from '../../database/entities/univ.entity';
import { UsersSemestersDto } from './users-semesters.dto';

export class UsersDto {
  readonly id: number;
  readonly name: string;
  readonly univName: string;
  readonly githubLink: string;
  readonly instagramLink: string;
  readonly blogLink: string;
  readonly semester: UsersSemestersDto[];

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
    semestersDtos: UsersSemestersDto[],
  ): UsersDto {
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
    semestersDtos: UsersSemestersDto[],
  ): UsersDto {
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
