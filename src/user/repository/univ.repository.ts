import { UnivModel } from '../domain/univ.model';
import { EntityManager } from 'typeorm';
import { UnivEntity } from '../../core/database/entities/univ.entity';

export interface UnivRepository {
  findById(id: number, manager? : EntityManager): Promise<UnivModel | null>;
  findByName(name: string, manager? : EntityManager): Promise<UnivModel | null>;
  findAllByName(name: string, manager? : EntityManager): Promise<UnivEntity[]>
  save(univ: UnivModel, manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}