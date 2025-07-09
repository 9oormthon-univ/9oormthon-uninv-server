import { DataSource, EntityManager } from 'typeorm';
import { ApplyModel } from '../domain/apply.model';
import { ApplyEntity } from '../../core/infra/entities/apply.entity';
import { ApplyMapper } from '../../core/infra/mapper/apply.mapper';
import { ERole } from '../../core/enums/role.enum';

export class ApplyRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findById(id: number, manager?: EntityManager): Promise<ApplyModel | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['user', 'user.univ', 'idea', 'idea.provider', 'idea.ideaSubject']
      }
    );

    return entity ? ApplyMapper.toDomain(entity) : null;
  }

  async findByIdeaIdAndPhase(ideaId: number, phase: number, manager?: EntityManager): Promise<ApplyModel[] | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { idea: { id: ideaId }, phase },
      }
    );

    return entities.length !== 0 ? ApplyMapper.toDomains(entities) : [];
  }

  async findByUserIdAndGenerationAndPhase(userId: number, generation: number, phase: number, manager?: EntityManager): Promise<ApplyModel[] | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { user: { id: userId }, idea: { generation }, phase },
        relations: ['user', 'idea', 'idea.provider', 'idea.ideaSubject', 'idea.team']
      }
    );

    return entities ? ApplyMapper.toDomains(entities) : null;
  }

  async findByUserIdAndGeneration(userId: number, generation: number, manager?: EntityManager): Promise<ApplyModel[] | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { user: { id: userId }, idea: { generation } },
        relations: ['user', 'idea', 'idea.provider', 'idea.ideaSubject', 'idea.team']
      }
    );

    return entities.length !== 0 ? ApplyMapper.toDomains(entities) : null;
  }

  async findByTeamIdAndGenerationAndPhase(teamId: number, generation: number, phase: number, manager?: EntityManager): Promise<ApplyModel[] | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entities = await repo.find(
      {
        where: { idea: { generation, team: { id: teamId } }, phase },
        relations: ['user', 'user.univ', 'idea', 'idea.provider', 'idea.ideaSubject', 'idea.team']
      }
    );

    return entities.length !== 0 ? ApplyMapper.toDomains(entities) : null;
  }

  async findByTeamIdAndGenerationAndPhaseSort(
    teamId: number,
    generation: number,
    phase: number,
    sorting: string,
    sortType: string,
    manager?: EntityManager
  ): Promise<ApplyModel[] | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const qb = repo.createQueryBuilder('apply')
      .leftJoinAndSelect('apply.user', 'user')
      .leftJoinAndSelect('user.univ', 'univ')
      .leftJoinAndSelect('apply.idea', 'idea')
      .leftJoinAndSelect('idea.provider', 'provider')
      .leftJoinAndSelect('idea.ideaSubject', 'ideaSubject')
      .leftJoinAndSelect('idea.team', 'team')
      .where('idea.generation = :generation', { generation })
      .andWhere('team.id = :teamId', { teamId })
      .andWhere('apply.phase = :phase', { phase });

    if (sorting && sortType) {
      if (sortType === 'ASC' || sortType === 'DESC') {
        switch (sorting) {
          case 'UNIV':
            qb.addOrderBy('univ.name', sortType);
            break;
          case 'ROLE':
            qb.addOrderBy('apply.role', sortType);
            break;
          case 'PREFERENCE':
            qb.addOrderBy('apply.preference', sortType);
            break;
          default:
            qb.addOrderBy('apply.preference', sortType);
            break;
        }
      } else {
        qb.orderBy('apply.preference', 'ASC'); // 기본 정렬
      }
    } else {
      qb.orderBy('apply.preference', 'ASC'); // 기본 정렬
    }

    const entities = await qb.getMany();
    return entities.length !== 0 ? ApplyMapper.toDomains(entities) : null;
  }

  async findByUserIdAndIdeaIdAndPhase(userId: number, ideaId: number, phase: number, manager?: EntityManager): Promise<ApplyModel | null> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    const entity = await repo.findOne(
      {
        where: { user: { id: userId }, idea: { id: ideaId }, phase },
        relations: ['user', 'idea', 'idea.provider', 'idea.ideaSubject']
      }
    );

    return entity ? ApplyMapper.toDomain(entity) : null;
  }

  async countByIdeaIdAndRole(ideaId: number, role: ERole, manager?: EntityManager): Promise<number> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    return repo.count(
      {
        where: { idea: { id: ideaId }, role }
      }
    );
  }

  async save(apply: ApplyModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    await repo.save(ApplyMapper.toEntity(apply));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    await repo.delete(id);
  }

  async deleteByIdeaId(ideaId: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(ApplyEntity) : this.dataSource.getRepository(ApplyEntity);

    await repo.delete({ idea: { id: ideaId } });
  }
}