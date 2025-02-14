import { EntityManager } from 'typeorm';
import { IdeaModel } from '../domain/idea.model';
import { IdeaOverviewDto } from '../application/dto/response/read-idea-overview.response.dto';

export interface IdeaRepository {
  findAll(manager? : EntityManager): Promise<IdeaModel[]>;
  findById(id: number, manager? : EntityManager): Promise<IdeaModel | null>;
  findByUserId(userId: number, manager? : EntityManager): Promise<IdeaModel[]>;
  findByUserIdAndIsBookmarked(userId: number, manager? : EntityManager): Promise<IdeaModel[]>;
  save(idea: IdeaModel, manager? : EntityManager): Promise<IdeaModel>;
  delete(id: number, manager? : EntityManager): Promise<void>;
  findIdeaOverview(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    userId: number,
    manager?: EntityManager
  ): Promise<{ ideas: IdeaOverviewDto[]; totalItems: number }>;
  findMyIdeaDetail(
    userId: number,
    manager?: EntityManager
  ): Promise<{ idea: IdeaModel; isBookmarked: boolean; isActive: boolean }>

  findIdeaDetail(
    ideaId: number,
    userId: number,
    manager?: EntityManager
  ): Promise<{ idea: IdeaModel; isBookmarked: boolean; isActive: boolean }>
}
