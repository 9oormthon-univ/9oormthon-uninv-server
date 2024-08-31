import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Univ } from '../entities/univ.entity';

@Injectable()
export class UnivRepository extends Repository<Univ> {
  async findAll(): Promise<Univ[]> {
    return await this.find();
  }

  async findById(id: number): Promise<Univ> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }
}
