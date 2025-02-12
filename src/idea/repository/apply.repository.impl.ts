import { ApplyRepository } from './apply.repository';
import { DataSource, EntityManager } from 'typeorm';
import { ApplyModel } from '../domain/apply.model';
import { ApplyEntity } from '../../core/infra/entities/apply.entity';
import { ApplyMapper } from '../infra/orm/mapper/apply.mapper';

export class ApplyRepositoryImpl implements ApplyRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAllByUserId(userId: number, manager?: EntityManager): Promise<ApplyModel[]> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { user: { id: userId } },
        relations: ['provider', 'ideaSubject']
      }
    );

    return ApplyMapper.toDomains(entities);
  }

  async findAllByIdeaId(ideaId: number, manager?: EntityManager): Promise<ApplyModel[]> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { idea: { id: ideaId } },
        relations: ['provider', 'ideaSubject']
      }
    );

    return ApplyMapper.toDomains(entities);
  }

  async findById(id: number, manager?: EntityManager): Promise<ApplyModel | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['provider', 'ideaSubject']
      }
    );

    return entity ? ApplyMapper.toDomain(entity) : null;
  }

  async save(apply: ApplyModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    await repo.save(ApplyMapper.toEntity(apply));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    await repo.delete(id);
  }
}