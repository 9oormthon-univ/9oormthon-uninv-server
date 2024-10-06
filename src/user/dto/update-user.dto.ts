import { Expose } from 'class-transformer';
import { UserSemesterDto } from './user-semester.dto';

export class UpdateUserDto {
  @Expose({ name: 'name' })
  readonly name: string;

  @Expose({ name: 'univ_name' })
  readonly univName: string;

  @Expose({ name: 'github_link' })
  readonly githubLink: string;

  @Expose({ name: 'instagram_link' })
  readonly instagramLink: string;

  @Expose({ name: 'blog_link' })
  readonly blogLink: string;

  @Expose({ name: 'semesters' })
  readonly semesters: UserSemesterDto[];
}
