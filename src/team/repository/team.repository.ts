import { DataSource, EntityManager } from 'typeorm';
import { TeamModel } from '../domain/team.model';
import { TeamEntity } from '../../core/infra/entities/team.entity';
import { TeamMapper } from '../../core/infra/mapper/team.mapper';
import { IdeaModel } from '../../idea/domain/idea.model';
import { TeamOverviewDto } from '../application/dto/response/read-team-overview.response.dto';

export class TeamRepository {
  constructor(private readonly dataSource: DataSource) {
  }

  async findWithMembersAndProjectAndIdeaById(id: number, manager?: EntityManager): Promise<TeamModel | undefined> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);
    const entity = await repo.findOne({
      where: { id },
      relations: ['members', 'members.team', 'members.user', 'members.user.univ', 'project', 'idea']
    });
    return entity ? TeamMapper.toDomain(entity, { skipIdea: true, skipMembers: false }) : undefined;
  }

  async findWithMembersById(id: number, manager?: EntityManager): Promise<TeamModel | undefined> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);
    const entity = await repo.findOne({
      where: { id },
      relations: ['members', 'members.team', 'members.user', 'members.user.univ'],
    });
    return entity ? TeamMapper.toDomain(entity, { skipIdea: true, skipMembers: false }) : undefined;
  }

  async findByUserIdAndGeneration(userId: number, generation: number, manager?: EntityManager): Promise<TeamModel | undefined> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);
    const entity = await repo.findOne({
      where: { members: { user: { id: userId } }, idea: { generation } },
      relations: ['idea', 'members', 'members.team', 'members.user', 'members.user.univ', 'idea.provider', 'idea.ideaSubject', 'idea.applies'],
    });
    return entity ? TeamMapper.toDomain(entity) : undefined;
  }

  async findByIdeaWithIdeaAndMembers(idea: IdeaModel, manager?: EntityManager): Promise<TeamModel | undefined> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);
    const entity = await repo.findOne({
      where: { idea: { id: idea.id } },
      relations: ['idea', 'members', 'members.team', 'members.user', 'members.user.univ', 'idea.provider', 'idea.ideaSubject'],
    });
    return entity ? TeamMapper.toDomain(entity) : undefined;
  }

  async findTeamOverview(
    page: number,
    size: number,
    generation: number,
    sorting: string,
    sortType: string,
    search: string,
    manager?: EntityManager,
  ): Promise<{ teams: TeamOverviewDto[]; totalItems: number }> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    const qb = repo.createQueryBuilder('team')
      .leftJoinAndSelect('team.project', 'project')
      .andWhere('team.generation = :generation', { generation });

    qb.addSelect(subQuery => {
      return subQuery
        .select('COUNT(1)')
        .from('members', 'member')
        .where('member.team_id = team.id');
    }, 'member_count');

    if (search) {
      qb.andWhere('team.name LIKE :search', { search: `%${search}%` });
    }

    if (sorting && sortType) {
      if (sortType === 'ASC' || sortType === 'DESC') {
        switch (sorting) {
          case 'TEAM_NUMBER':
            qb.orderBy('team.number', sortType);
            break;
          case 'TEAM_NAME':
            qb.orderBy('team.name', sortType);
            break;
          case 'SERVICE_NAME':
            qb.orderBy('project.name', sortType);
            break;
          case 'MEMBER_COUNT':
            qb.orderBy('member_count', sortType);
            break;
          case 'TEAM_BUILDING':
            qb.addSelect(subQuery => {
              return subQuery
                .select('COUNT(1)')
                .from('teams', 't')
                .where('team.status = :status', { status: 'END' });
            }, 'team_building_count')
              .orderBy('team_building_count', sortType);
            break;
          default:
            qb.orderBy('team.id', sortType);
            break;
        }
        qb.skip((page - 1) * size)
          .take(size)
          .distinct(true);
      }
    }

    const totalItems = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();

    const teams: TeamOverviewDto[] = entities.map((team, index) => {
      const rawRow = raw[index];
      return {
        id: team.id,
        number: team.number ? team.number : 0,
        name: team.name ? team.name : '',
        service_name: team.project ? team.project.name : '',
        member_count: rawRow.member_count ? parseInt(rawRow.member_count, 10) : 0,
        team_building: team.status,
      };
    });

    return { teams, totalItems };
  }

  async saveAndReturn(team: TeamModel, manager?: EntityManager): Promise<TeamModel> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    return TeamMapper.toDomain(await repo.save(TeamMapper.toEntity(team)));
  }

  async saveAndReturnSkipIdeaTrue(team: TeamModel, manager?: EntityManager): Promise<TeamModel> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    return TeamMapper.toDomain(await repo.save(TeamMapper.toEntity(team)), { skipIdea: true });
  }



  async save(team: TeamModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    await repo.save(TeamMapper.toEntity(team));
  }

  async delete(team: TeamModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(TeamEntity) : this.dataSource.getRepository(TeamEntity);

    await repo.remove(TeamMapper.toEntity(team));
  }
}