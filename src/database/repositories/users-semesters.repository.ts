import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersSemesters } from '../entities/users-semesters';

@Injectable()
export class UsersSemestersRepository extends Repository<UsersSemesters> {
  constructor(private dataSource: DataSource) {
    super(UsersSemesters, dataSource.createEntityManager());
  }
}
