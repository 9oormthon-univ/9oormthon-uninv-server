import { IdeaRepository } from './idea.repository';
import { DataSource, EntityManager } from 'typeorm';
import { IdeaModel } from '../domain/idea.model';
import { IdeaEntity } from '../../core/infra/entities/idea.entity';
import { IdeaMapper } from '../infra/orm/mapper/idea.mapper';

export class IdeaRepositoryImpl implements IdeaRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findAll(manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.find();

    return IdeaMapper.toDomains(entities);
  }

  async findById(id: number, manager?: EntityManager): Promise<IdeaModel | null> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['provider', 'ideaSubject']
      }
    );

    return entity ? IdeaMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: number, manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.find(
      {
        where: { provider: { id: userId } },
        relations: ['provider', 'ideaSubject']
      }
    );

    return IdeaMapper.toDomains(entities);
  }

  async findByUserIdAndIsBookmarked(userId: number, manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager
      ? manager.getRepository(IdeaEntity)
      : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.createQueryBuilder('idea')
      .innerJoin('idea.bookmarks', 'bookmark')
      .innerJoin('bookmark.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return IdeaMapper.toDomains(entities);
  }

  async save(idea: IdeaModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    await repo.save(IdeaMapper.toEntity(idea));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    await repo.delete(id);
  }

  async getIsBookmarkedByUserIdAndIdeaIds(userId: number, ideaIds: number[], manager?: EntityManager): Promise<{ ideaId: number, isBookmarked: boolean }[]> {
    const repo = manager
      ? manager.getRepository(IdeaEntity)
      : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.createQueryBuilder('idea')
      .leftJoin('idea.bookmarks', 'bookmark')
      .leftJoin('bookmark.user', 'user')
      .select('idea.id as ideaId')
      .addSelect('CASE WHEN user.id = :userId THEN true ELSE false END as isBookmarked', 'isBookmarked')
      .where('idea.id IN (:...ideaIds)', { ideaIds })
      .setParameter('userId', userId)
      .getRawMany();

    return entities.map(({ ideaId, isBookmarked }) => ({ ideaId, isBookmarked }));
  }
}