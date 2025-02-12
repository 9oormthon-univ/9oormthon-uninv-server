import { EntityManager } from 'typeorm';
import { BookmarkModel } from '../domain/bookmark.model';

export interface BookmarkRepository {
  findByUserIdAndIdeaId(userId: number, ideaId: number, manager? : EntityManager): Promise<BookmarkModel | undefined>;
  save(bookmark: BookmarkModel, manager? : EntityManager): Promise<void>;
  delete(bookmark: BookmarkModel, manager? : EntityManager): Promise<void>;
}