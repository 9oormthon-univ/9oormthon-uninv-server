import { UnivEntity } from '../entities/univ.entity';
import { UnivModel } from '../../../user/domain/univ.model';
import { UserMapper } from './user.mapper';

export class UnivMapper {
  static toDomain(entity: UnivEntity): UnivModel {
    return {
      id: entity.id,
      name: entity.name,
      instagramUrl: entity.instagramUrl,
      generation: entity.generation,
      leader: entity.leader ? UserMapper.toDomain(entity.leader) : null,
      createdAt: entity.createdAt,
    };
  }

  static toDomains(entities: UnivEntity[]): UnivModel[] {
    return entities.map(entity => this.toDomain(entity));
  }

  static toEntity(domain: UnivModel): UnivEntity {
    const entity = new UnivEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.instagramUrl = domain.instagramUrl;
    entity.generation = domain.generation;
    entity.leader = domain.leader ? UserMapper.toEntity(domain.leader) : null;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}