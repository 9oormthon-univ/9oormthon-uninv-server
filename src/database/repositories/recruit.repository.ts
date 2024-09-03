import { Injectable } from '@nestjs/common';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Recruit } from '../entities/recruit.entity';

@Injectable()
export class RecruitRepository extends Repository<Recruit> {
  constructor(private dataSource: DataSource) {
    super(Recruit, dataSource.createEntityManager());
  }
  async findLatestRecruit(): Promise<Recruit | null> {
    const today = new Date();

    // 오늘 날짜를 포함하는 모집을 먼저 찾음
    let recruit = await this.findOne({
      where: [
        { startAt: LessThanOrEqual(today), endAt: MoreThanOrEqual(today) },
      ],
      order: { startAt: 'ASC' },
    });

    // 오늘 포함하는 모집이 없다면, 오늘 이후 시작하는 가장 가까운 모집을 찾음
    if (!recruit) {
      recruit = await this.findOne({
        where: { startAt: MoreThanOrEqual(today) },
        order: { startAt: 'ASC' },
      });
    }

    return recruit;
  }
}
