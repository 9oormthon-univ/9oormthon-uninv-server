import { TeamRepository } from './team.repository';
import { DataSource, EntityManager } from 'typeorm';
import { TeamModel } from '../domain/team.model';
import { TeamEntity } from '../../core/infra/entities/team.entity';
import { TeamMapper } from '../infra/orm/mapper/team.mapper';
import { IdeaModel } from '../../idea/domain/idea.model';

export class TeamRepositoryImpl implements TeamRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByIdeaWithIdeaAndMembers(idea: IdeaModel, manager?: EntityManager): Promise<TeamModel | undefined> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);
    const entity = await repo.findOne({
      where: { idea: { id: idea.id } },
      relations: ['idea', 'members', 'members.team', 'members.user', 'members.user.univ', 'idea.provider', 'idea.ideaSubject'],
    });
    return entity ? TeamMapper.toDomain(entity) : undefined;
  }

  async save(team: TeamModel, manager?: EntityManager): Promise<TeamModel> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    return TeamMapper.toDomain(await repo.save(TeamMapper.toEntity(team)));
  }
}