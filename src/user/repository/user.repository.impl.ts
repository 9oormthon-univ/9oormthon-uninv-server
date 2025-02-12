import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { DataSource, EntityManager } from 'typeorm';
import { UserModel } from '../domain/user.model';
import { UserEntity } from '../../core/infra/entities/user.entity';
import { UserMapper } from '../infra/orm/mapper/user.mapper';
import { ESecurityRole } from '../../core/enums/security-role.enum';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByIdWithUniv(id: number, manager?: EntityManager): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    const entity = await repo.findOne(
      {
        where: { id },
        relations: ['univ']
      }
    );
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async findByPhoneNumberAndUniv(
    phoneNumber: string,
    univId: number,
    manager?: EntityManager
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
    manager?: EntityManager
  ): Promise<UserModel | null> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = await repo.findOne({
      where: { id, refreshToken, role },
      relations: ['univ'],
    });
    return entity ? UserMapper.toDomain(entity) : null;
  }

  async save(user: UserModel, manager? : EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entity = UserMapper.toEntity(user);
    await repo.save(entity);
  }

  async saveAll(users: UserModel[], manager? : EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);
    const entities = users.map((user) => UserMapper.toEntity(user));
    await repo.save(entities);
  }

  async delete(id: number, manager? : EntityManager): Promise<void> {

    const repo = manager ? manager.getRepository(UserEntity) : this.dataSource.getRepository(UserEntity);

    await repo.delete(id);
  }
}