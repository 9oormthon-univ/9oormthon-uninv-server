import { BookmarkRepository } from './bookmark.repository';
import { DataSource, EntityManager } from 'typeorm';
import { BookmarkModel } from '../domain/bookmark.model';
import { BookmarkEntity } from '../../core/infra/entities/bookmark.entity';
import { BookmarkMapper } from '../infra/orm/mapper/bookmark.mapper';

export class BookmarkRepositoryImpl implements BookmarkRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(bookmark: BookmarkModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(BookmarkEntity) : this.dataSource.getRepository(BookmarkEntity);

    await repo.save(BookmarkMapper.toEntity(bookmark));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(BookmarkEntity) : this.dataSource.getRepository(BookmarkEntity);

    await repo.delete(id);
  }
}