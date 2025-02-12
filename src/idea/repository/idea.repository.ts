import { EntityManager } from 'typeorm';
import { IdeaModel } from '../domain/idea.model';

export interface IdeaRepository {
  findAll(manager? : EntityManager): Promise<IdeaModel[]>;
  findById(id: number, manager? : EntityManager): Promise<IdeaModel | null>;
  findByUserId(userId: number, manager? : EntityManager): Promise<IdeaModel[]>;
  findByUserIdAndIsBookmarked(userId: number, manager? : EntityManager): Promise<IdeaModel[]>;
  save(idea: IdeaModel, manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}
