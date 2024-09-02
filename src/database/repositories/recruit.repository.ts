import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Recruit } from '../entities/recruit.entity';

@Injectable()
export class RecruitRepository extends Repository<Recruit> {
  constructor(private dataSource: DataSource) {
    super(Recruit, dataSource.createEntityManager());
  }
}
