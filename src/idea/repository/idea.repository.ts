import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaEntity } from '../../core/database/entities/idea.entity';

@Injectable()
export class IdeaRepository extends Repository<IdeaEntity> {
  async findAll(): Promise<IdeaEntity[]> {
    return await this.find();
  }

  async findById(id: number): Promise<IdeaEntity> {
    return await this.findOne({
      where: {
        id: id,
      },
    });
  }
}
