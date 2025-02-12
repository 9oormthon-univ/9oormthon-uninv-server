import { EntityManager } from 'typeorm';
import { ApplyModel } from '../domain/apply.model';

export interface ApplyRepository {
  findAllByUserId(userId: number, manager? : EntityManager): Promise<ApplyModel[]>;
  findAllByIdeaId(ideaId: number, manager? : EntityManager): Promise<ApplyModel[]>;
  findById(id: number, manager? : EntityManager): Promise<ApplyModel | null>;
  save(apply: ApplyModel, manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}