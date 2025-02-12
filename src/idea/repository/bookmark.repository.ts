import { EntityManager } from 'typeorm';
import { BookmarkModel } from '../domain/bookmark.model';

export interface BookmarkRepository {
  save(bookmark: BookmarkModel, manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}