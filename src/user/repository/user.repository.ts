import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UserModel } from '../domain/user.model';
import { UserEntity } from '../../core/infra/entities/user.entity';
import { UserMapper } from '../../core/infra/mapper/user.mapper';
import { ESecurityRole } from '../../core/enums/security-role.enum';
import { UserOverviewDto } from '../application/dto/response/read-user-overview.response.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly dataSource: DataSource) {
  }

  async findById(id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { id },
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdWithUnivAndLinks(id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { id },
      relations: ['univ', 'links'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdWithUniv(id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['univ'],
      },
    );
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdWithLinks(id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['links'],
      },
    );
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findAllByUnivId(
    univId: number,
    manager?: EntityManager,
  ): Promise<UserModel[]> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entities = await repo.find({
      where: { univ: { id: univId } },
      relations: ['univ'],
    });
    return entities.map((entity) => UserMapper.toDomain(entity));
  }

  async findAllByUnivIdAndSearchAndGeneration(
    univId: number,
    search: string,
    generation: number,
    manager?: EntityManager,
  ): Promise<UserModel[]> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    const qb = repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.univ', 'univ');

    if (univId) {
      qb.andWhere('univ.id = :univId', { univId });
    }

    if (search) {
      qb.andWhere('user.name LIKE :search OR user.phoneNumber LIKE :search', { search: `%${search}%` });
    }

    if (generation !== undefined && generation !== null) {
      qb.andWhere('FIND_IN_SET(:generation, user.generations)', { generation: generation.toString() });
    }

    const entities = await qb.getMany();
    return entities.map((entity) => UserMapper.toDomain(entity));
  }


  async findByPhoneNumberAndUniv(
    phoneNumber: string,
    univId: number,
    manager?: EntityManager,
  ): Promise<UserModel | null> {

    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { phoneNumber, univ: { id: univId } },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findBySerialId(serialId: string, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { serialId },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByRefreshTokenAndId(refreshToken: string, id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { refreshToken, id },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdAndRole(id: number, role: ESecurityRole, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { id, role },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByIdAndRefreshTokenAndRole(
    id: number,
    refreshToken: string,
    role: ESecurityRole,
    manager?: EntityManager,
  ): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { id, refreshToken, role },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findUserOverview(
    page: number,
    size: number,
    generation: number,
    univId: number | undefined,
    search: string | undefined,
    manager?: EntityManager,
  ): Promise<{ users: UserOverviewDto[]; totalItems: number }> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    const qb = repo.createQueryBuilder('user')
      .leftJoinAndSelect('user.univ', 'univ')
      .andWhere('FIND_IN_SET(:generation, user.generations)', { generation: generation.toString() })
      .andWhere('user.role = :role', { role: ESecurityRole.USER });

    if (univId) {
      qb.andWhere('univ.id = :univId', { univId });
    }

    if (search) {
      qb.andWhere('user.name LIKE :search OR user.phoneNumber LIKE :search', { search: `%${search}%` });
    }

    qb.addSelect(subQuery => {
      return subQuery
        .select('COUNT(1)')
        .from('members', 'member')
        .innerJoin('teams', 'team', 'member.team_id = team.id')
        .where('member.user_id = user.id')
        .andWhere('team.generation = :generation', { generation });
    }, 'team_building_count');


    // 정렬 및 페이지네이션
    qb.orderBy('user.name', 'ASC')
      .skip((page - 1) * size)
      .take(size)
      .distinct(true);

    const totalItems = await qb.getCount();
    const { entities, raw } = await qb.getRawAndEntities();

    const users: UserOverviewDto[] = entities.map((user, index) => {
      const rawRow = raw[index];
      return {
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.serialId,
        team_building: Number(rawRow['team_building_count']) > 0,
        generations: user.generations && user.generations.length > 0
          ? user.generations.map(g => `${g}기`).join(', ')
          : '',
      };
    });

    return { users, totalItems };
  }

  async save(user: UserModel, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = UserMapper.toEntity(user);
    await repo.save(entity);
  }

  async saveAll(users: UserModel[], manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entities = users.map((user) => UserMapper.toEntity(user));
    await repo.save(entities);
  }

  async delete(id: number, manager?: EntityManager): Promise<void> {

    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    await repo.delete(id);
  }
}