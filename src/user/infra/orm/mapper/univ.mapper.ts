import { UnivEntity } from '../../../../core/database/entities/univ.entity';
import { UnivModel } from '../../../domain/univ.model';

export class UnivMapper {
  static toDomain(entity: UnivEntity): UnivModel {
    return {
      id: entity.id,
      name: entity.name,
      instagramUrl: entity.instagramUrl,
      imgUrl: entity.imgUrl,
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
    entity.imgUrl = domain.imgUrl;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}