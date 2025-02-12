import { IdeaSubjectModel } from '../domain/idea-subject.model';
import { EntityManager } from 'typeorm';

export interface IdeaSubjectRepository {
  findAll(manager? : EntityManager): Promise<IdeaSubjectModel[]>;
  findById(id: number, manager? : EntityManager): Promise<IdeaSubjectModel | null>;
  save(ideaSubject: IdeaSubjectModel, manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}
