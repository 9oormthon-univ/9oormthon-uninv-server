import { Injectable } from '@nestjs/common';
import { DataSource, Like, Repository } from 'typeorm';
import { Univ } from '../entities/univ.entity';

@Injectable()
export class UnivRepository extends Repository<Univ> {
  constructor(private dataSource: DataSource) {
    super(Univ, dataSource.createEntityManager());
  }
  async findByName(name: string): Promise<Univ[]> {
    return await this.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }
}
