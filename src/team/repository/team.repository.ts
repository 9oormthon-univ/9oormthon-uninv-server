import { TeamModel } from '../domain/team.model';
import { EntityManager } from 'typeorm';
import { TeamEntity } from '../../core/infra/entities/team.entity';
import { IdeaModel } from '../../idea/domain/idea.model';

export interface TeamRepository {
  findByIdeaWithIdeaAndMembers(idea: IdeaModel, manager?: EntityManager): Promise<TeamModel | undefined>;
  save(team: TeamModel, manager? : EntityManager) : Promise<TeamModel>;
}