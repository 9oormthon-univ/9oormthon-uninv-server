import { ApplyEntity } from '../../../../core/infra/entities/apply.entity';
import { ApplyModel } from '../../../domain/apply.model';
import { UserMapper } from '../../../../user/infra/orm/mapper/user.mapper';
import { IdeaMapper } from './idea.mapper';

export class ApplyMapper {
  static toDomain(entity: ApplyEntity): ApplyModel {
    return new ApplyModel(
      entity.id,
      entity.phase,
      entity.status,
      entity.preference,
      entity.motivation,
      entity.role,
      UserMapper.toDomain(entity.user),
      IdeaMapper.toDomain(entity.idea),
      entity.createdAt
    );
  }

  static toEntity(domain: ApplyModel): ApplyEntity {
    const entity = new ApplyEntity();
    entity.id = domain.id;
    entity.phase = domain.phase;
    entity.status = domain.status;
    entity.preference = domain.preference;
    entity.motivation = domain.motivation;
    entity.role = domain.role;
    if (domain.user) {
      entity.user = UserMapper.toEntity(domain.user);
    }
    if (domain.idea) {
      entity.idea = IdeaMapper.toEntity(domain.idea);
    }
    entity.createdAt = domain.createdAt;
    return entity;
  }
}
