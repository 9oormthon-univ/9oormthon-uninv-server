import { MemberRepository } from './member.repository';
import { DataSource, EntityManager } from 'typeorm';
import { MemberModel } from '../domain/member.model';
import { MemberMapper } from '../infra/orm/mapper/member.mapper';
import { MemberEntity } from '../../core/infra/entities/member.entity';

export class MemberRepositoryImpl implements MemberRepository {
  constructor(private readonly dataSource: DataSource) {}

  async save(member: MemberModel, manager? : EntityManager) : Promise<void> {
    const repo = manager ? manager.getRepository(MemberEntity) : this.dataSource.getRepository(MemberEntity);

    await repo.save(MemberMapper.toEntity(member));
  }
}