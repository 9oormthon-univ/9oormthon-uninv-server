import { Expose } from 'class-transformer';
import { UsersSemesters } from '../../database/entities/users-semesters';

export class UsersSemestersDto {
  @Expose({ name: 'semester' })
  readonly semester: string;

  @Expose({ name: 'role' })
  readonly role: string;

  static fromEntity(semester: UsersSemesters): UsersSemestersDto {
    return {
      semester: semester.semester,
      role: semester.role,
    };
  }
}
