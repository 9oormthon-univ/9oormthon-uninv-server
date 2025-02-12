import { BookmarkRepository } from './bookmark.repository';
import { DataSource, EntityManager } from 'typeorm';
import { BookmarkModel } from '../domain/bookmark.model';
import { BookmarkEntity } from '../../core/infra/entities/bookmark.entity';
import { BookmarkMapper } from '../infra/orm/mapper/bookmark.mapper';

export class BookmarkRepositoryImpl implements BookmarkRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByUserIdAndIdeaId(userId: number, ideaId: number, manager?: EntityManager): Promise<BookmarkModel | undefined> {
    const repo = manager ? manager.getRepository(BookmarkEntity) : this.dataSource.getRepository(BookmarkEntity);

    const bookmark = await repo.findOne({
      where: {
        user: { id: userId },
        idea: { id: ideaId }
      },
      relations: ['user', 'idea', 'idea.provider', 'idea.ideaSubject']
    });
    return bookmark ? BookmarkMapper.toDomain(bookmark) : undefined;
  }

  async save(bookmark: BookmarkModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(BookmarkEntity) : this.dataSource.getRepository(BookmarkEntity);

    await repo.save(BookmarkMapper.toEntity(bookmark));
  }

  async delete(bookmark: BookmarkModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(BookmarkEntity) : this.dataSource.getRepository(BookmarkEntity);

    const entity = BookmarkMapper.toEntity(bookmark);

    await repo.delete(entity);
  }
}