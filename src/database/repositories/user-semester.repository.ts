import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UserSemester } from '../entities/user-semester';

@Injectable()
export class UserSemesterRepository extends Repository<UserSemester> {
  constructor(private dataSource: DataSource) {
    super(UserSemester, dataSource.createEntityManager());
  }
}
