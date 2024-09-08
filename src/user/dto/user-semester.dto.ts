import { Expose } from 'class-transformer';
import { UserSemester } from '../../database/entities/user-semester';

export class UserSemesterDto {
  @Expose({ name: 'semester' })
  readonly semester: string;

  @Expose({ name: 'role' })
  readonly role: string;

  static fromEntity(semester: UserSemester): UserSemesterDto {
    return {
      semester: semester.semester,
      role: semester.role,
    };
  }
}
