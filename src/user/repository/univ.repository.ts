import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, Like } from 'typeorm';
import { UnivEntity } from '../../core/infra/entities/univ.entity';
import { UnivMapper } from '../../core/infra/mapper/univ.mapper';

@Injectable()
export class UnivRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById (id: number, manager?: EntityManager): Promise<UnivEntity | null> {
    const repo = manager ? manager.getRepository(UnivEntity) : this.dataSource.getRepository(UnivEntity);
    const entity = await repo.findOne(
      {
        where: { id },
      }
    );
    return entity ? UnivMapper.toDomain(entity) : null;
  }

  async findByName(name: string, manager?: EntityManager): Promise<UnivEntity | null> {
    const repo = manager ? manager.getRepository(UnivEntity) : this.dataSource.getRepository(UnivEntity);
    const entity = await repo.findOne(
      {
        where: { name },
      }
    );
    return entity ? UnivMapper.toDomain(entity) : null;
  }

  async findAllByName(name: string, manager? : EntityManager): Promise<UnivEntity[]> {
    const repo = manager ? manager.getRepository(UnivEntity) : this.dataSource.getRepository(UnivEntity);
    const entities = await repo.find({
      where: {
        name: Like(`%${name}%`),
      },
    });
    return entities ? UnivMapper.toDomains(entities) : [];
  }

  async save(univ: UnivEntity, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UnivEntity) : this.dataSource.getRepository(UnivEntity);
    const entity = UnivMapper.toEntity(univ);
    await repo.save(entity);
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UnivEntity) : this.dataSource.getRepository(UnivEntity);
    await repo.delete(id);
  }
}
