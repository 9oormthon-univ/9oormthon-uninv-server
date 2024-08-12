import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Idea } from '../entities/idea.entity';

@Injectable()
export class IdeaRepository extends Repository<Idea> {
  async findAll(): Promise<Idea[]> {
    return await this.find();
  }

  async findById(id: number): Promise<Idea> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }
}
