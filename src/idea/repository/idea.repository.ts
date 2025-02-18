import { DataSource, EntityManager } from 'typeorm';
import { IdeaModel } from '../domain/idea.model';
import { IdeaEntity } from '../../core/infra/entities/idea.entity';
import { IdeaMapper } from '../../core/infra/mapper/idea.mapper';
import { IdeaOverviewDto } from '../application/dto/response/read-idea-overview.response.dto';

export class IdeaRepository {
  constructor(private readonly dataSource: DataSource) {
  }

  async findAll(manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.find();

    return IdeaMapper.toDomains(entities);
  }

  async findById(id: number, manager?: EntityManager): Promise<IdeaModel | null> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['provider', 'ideaSubject']
      }
    );

    return entity ? IdeaMapper.toDomain(entity) : null;
  }

  async findByUserId(userId: number, manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.find(
      {
        where: { provider: { id: userId } },
        relations: ['provider', 'ideaSubject']
      }
    );

    return IdeaMapper.toDomains(entities);
  }

  async findByUserIdAndIsBookmarked(userId: number, manager?: EntityManager): Promise<IdeaModel[]> {
    const repo = manager
      ? manager.getRepository(IdeaEntity)
      : this.dataSource.getRepository(IdeaEntity);

    const entities = await repo.createQueryBuilder('idea')
      .innerJoin('idea.bookmarks', 'bookmark')
      .innerJoin('bookmark.user', 'user')
      .where('user.id = :userId', { userId })
      .getMany();

    return IdeaMapper.toDomains(entities);
  }

  async save(idea: IdeaModel, manager?: EntityManager): Promise<IdeaModel> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    return IdeaMapper.toDomain(await repo.save(IdeaMapper.toEntity(idea)));
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    await repo.delete(id);
  }

  async findIdeaOverview(
    page: number,
    size: number,
    generation: number,
    subjectId: number | undefined,
    isActive: boolean | undefined,
    isBookmarked: boolean | undefined,
    userId: number,
    manager?: EntityManager
  ): Promise<{ ideas: IdeaOverviewDto[]; totalItems: number }> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    // 아이디어 엔티티와 아이디어 주제(ideaSubject)를 조인
    const qb = repo.createQueryBuilder('idea')
      .leftJoinAndSelect('idea.ideaSubject', 'ideaSubject')
      .where('idea.generation = :generation', { generation });

    // subject-id 필터
    if (subjectId) {
      qb.andWhere('ideaSubject.id = :subjectId', { subjectId });
    }

    // is-bookmarked 필터
    if (isBookmarked === true) {
      qb.andWhere(`(SELECT COUNT(*) FROM bookmarks b WHERE b.idea_id = idea.id AND b.user_id = :userId) > 0`);
    }

    // bookmark_count를 서브쿼리로 계산 (나중에 매핑할 때 사용)
    qb.addSelect(
      `(SELECT COUNT(*) FROM bookmarks b WHERE b.idea_id = idea.id AND b.user_id = :userId)`,
      'bookmark_count'
    );

    // is_active 계산. 서브쿼리로 각 아이디어의 모집 상태 산출
    qb.addSelect(`
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM teams t WHERE t.idea_id = idea.id
        )
        AND EXISTS (
          SELECT 1 FROM teams t 
          WHERE t.idea_id = idea.id 
            AND (
              t.pm_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM'
              )
           OR t.pd_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD'
              )
           OR t.fe_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE'
              )
           OR t.be_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE'
              )
            )
        )
      THEN true ELSE false END
    `, 'is_active');

    // is-active 필터 조건 적용
    if (typeof isActive === 'boolean') {
      if (isActive === true) {
        // 모집중은, 한 팀 내의 어느 직군이라도 capacity보다 member 수가 적은 경우
        qb.andWhere(`(
          EXISTS (
            SELECT 1 FROM teams t 
            WHERE t.idea_id = idea.id 
              AND (
                t.pm_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM')
             OR t.pd_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD')
             OR t.fe_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE')
             OR t.be_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE')
              )
          )
        )`);
      } else {
        // 모집완료는, 적어도 하나의 팀이 존재하며, 모든 팀에서 각 직군의 capacity가 모두 채워진 경우
        qb.andWhere(`(
          NOT EXISTS (
            SELECT 1 FROM teams t 
            WHERE t.idea_id = idea.id 
              AND (
                t.pm_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM')
             OR t.pd_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD')
             OR t.fe_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE')
             OR t.be_capacity > (SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE')
              )
          )
        )`);
      }
    }

    // 정렬 및 페이지네이션 적용
    qb.setParameter('userId', userId)
      .orderBy('idea.createdAt', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .distinct(true);

    const totalItems = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();

    const ideas: IdeaOverviewDto[] = entities.map((idea, index) => {
      const rawRow = raw[index];
      return {
        id: idea.id,
        subject: idea.ideaSubject ? idea.ideaSubject.name : null,
        title: idea.title,
        summary: idea.summary,
        is_active: Number(rawRow.is_active) === 1,
        is_bookmarked: Number(rawRow.bookmark_count) > 0,
      };
    });

    return { ideas, totalItems };
  }

  async findMyIdeaDetail(
    userId: number,
    manager?: EntityManager
  ): Promise<{ idea: IdeaModel; isBookmarked: boolean; isActive: boolean }> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const qb = repo.createQueryBuilder('idea')
      .leftJoinAndSelect('idea.ideaSubject', 'ideaSubject')
      .leftJoinAndSelect('idea.provider', 'provider')
      .leftJoinAndSelect('provider.univ', 'providerUniv')
      .leftJoinAndSelect('idea.team', 'team')
      .leftJoinAndSelect('team.members', 'member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('memberUser.univ', 'univ')

      .where('idea.provider.id = :userId', { userId })
      // is-bookmarked 계산
      .addSelect(
        `(SELECT COUNT(*) FROM bookmarks b WHERE b.idea_id = idea.id AND b.user_id = :userId)`,
        'bookmark_count'
      );

    // is-bookmarked 계산
    qb.leftJoin('idea.bookmarks', 'bookmark', 'bookmark.user_id = :userId', { userId });

    // is-active 계산. 서브쿼리로 각 아이디어의 모집 상태 산출
    qb.addSelect(`
      CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM teams t WHERE t.idea_id = idea.id
        )
        OR EXISTS (
          SELECT 1 FROM teams t 
          WHERE t.idea_id = idea.id 
            AND (
              t.pm_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM'
              )
           OR t.pd_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD'
              )
           OR t.fe_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE'
              )
           OR t.be_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE'
              )
            )
        )
      THEN true ELSE false END
    `, 'is_active')
      .setParameter('userId', userId)
      .distinct(true);

    const { entities, raw } = await qb.getRawAndEntities();

    if (entities.length === 0) {
      return { idea: null, isBookmarked: false, isActive: false };
    }

    const idea = IdeaMapper.toDomain(entities[0]);
    const bookmarkCount = Number(raw[0].bookmark_count);
    const isBookmarked = bookmarkCount > 0;
    const isActive = raw[0].is_active === true || raw[0].is_active === 'true' || raw[0].is_active == 1;

    return { idea, isBookmarked, isActive };
  }

  async findIdeaDetail(
    ideaId: number,
    userId: number,
    manager?: EntityManager
  ): Promise<{ idea: IdeaModel; isBookmarked: boolean; isActive: boolean }> {
    const repo = manager ? manager.getRepository(IdeaEntity) : this.dataSource.getRepository(IdeaEntity);

    const qb = repo.createQueryBuilder('idea')
      .leftJoinAndSelect('idea.ideaSubject', 'ideaSubject')
      .leftJoinAndSelect('idea.provider', 'provider')
      .leftJoinAndSelect('provider.univ', 'providerUniv')
      .leftJoinAndSelect('idea.team', 'team')
      .leftJoinAndSelect('team.members', 'member')
      .leftJoinAndSelect('member.user', 'memberUser')
      .leftJoinAndSelect('memberUser.univ', 'univ')

      .where('idea.id = :ideaId', { ideaId })

      // is-bookmarked 계산
      .addSelect(
        `(SELECT COUNT(*) FROM bookmarks b WHERE b.idea_id = idea.id AND b.user_id = :userId)`,
        'bookmark_count'
      );
    // is-active 계산. 서브쿼리로 각 아이디어의 모집 상태 산출
    qb.addSelect(`
      CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM teams t WHERE t.idea_id = idea.id
        )
        OR EXISTS (
          SELECT 1 FROM teams t 
          WHERE t.idea_id = idea.id 
            AND (
              t.pm_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PM'
              )
           OR t.pd_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'PD'
              )
           OR t.fe_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'FE'
              )
           OR t.be_capacity > (
                SELECT COUNT(*) FROM members m WHERE m.team_id = t.id AND m.role = 'BE'
              )
            )
        )
      THEN true ELSE false END
    `, 'is_active')
      .setParameter('userId', userId)
      .distinct(true);

    const { entities, raw } = await qb.getRawAndEntities();

    if (entities.length === 0) {
      return { idea: null, isBookmarked: false, isActive: false };
    }

    const idea = IdeaMapper.toDomain(entities[0]);
    const bookmarkCount = Number(raw[0].bookmark_count);
    const isBookmarked = bookmarkCount > 0;
    const isActive = raw[0].is_active === true || raw[0].is_active === 'true' || raw[0].is_active == 1;

    return { idea, isBookmarked, isActive };
  }

}