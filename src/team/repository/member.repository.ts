import { DataSource, EntityManager } from 'typeorm';
import { MemberModel } from '../domain/member.model';
import { MemberMapper } from '../../core/infra/mapper/member.mapper';
import { MemberEntity } from '../../core/infra/entities/member.entity';

export class MemberRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findByUserIdAndGeneration(userId: number, generation: number, manager?: EntityManager): Promise<MemberModel | undefined> {
    const repo = manager ? manager.getRepository(MemberEntity) : this.dataSource.getRepository(MemberEntity);

    const member = await repo.findOne({
      where: {
        user: { id: userId },
        team: { generation: generation }
      },
      relations: ['user']
    });
    return member ? MemberMapper.toDomain(member) : undefined;
  }

  async save(member: MemberModel, manager? : EntityManager) : Promise<void> {
    const repo = manager ? manager.getRepository(MemberEntity) : this.dataSource.getRepository(MemberEntity);

    await repo.save(MemberMapper.toEntity(member));
  }
}