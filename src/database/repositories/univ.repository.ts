import { Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { Univ } from '../entities/univ.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnivRepository {
  constructor(
    @InjectRepository(Univ)
    private repository: Repository<Univ>,
  ) {}
  async findAll(): Promise<Univ[]> {
    return await this.repository.find();
  }

  async findById(id: number): Promise<Univ> {
    return await this.repository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findByName(name: string): Promise<Univ[]> {
    return await this.repository.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
  }
}
