import { LinkEntity } from '../entities/link.entity';
import { LinkModel } from '../../../user/domain/link.model';
import { UserMapper } from './user.mapper';

export class LinkMapper {
  static toDomain(entity: LinkEntity): LinkModel {
    return new LinkModel(
      entity.id,
      entity.type,
      entity.url,
      entity.user ? UserMapper.toDomain(entity.user) : null
    );
  }

  static toDomains(entities: LinkEntity[]): LinkModel[] {
    return entities.map(entity => this.toDomain(entity));
  }

  static toEntity(domain: LinkModel): LinkEntity {
    const entity = new LinkEntity();
    entity.id = domain.id;
    entity.type = domain.type;
    entity.url = domain.url;
    if (domain.user) {
      entity.user = UserMapper.toEntity(domain.user);
    }
    return entity;
  }
}