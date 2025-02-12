import { TeamEntity } from '../../../../core/infra/entities/team.entity';
import { TeamModel } from '../../../domain/team.model';
import { IdeaMapper } from '../../../../idea/infra/orm/mapper/idea.mapper';

export class TeamMapper {
  static toDomain(entity:TeamEntity): TeamModel {
    return new TeamModel(
      entity.id,
      entity.name,
      entity.number,
      entity.generation,
      entity.pmCapacity,
      entity.pdCapacity,
      entity.feCapacity,
      entity.beCapacity,
      IdeaMapper.toDomain(entity.idea),
      entity.createdAt
    );
  }

  static toEntity(domain: TeamModel): TeamEntity {
    const entity = new TeamEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.number = domain.number;
    entity.generation = domain.generation;
    entity.pmCapacity = domain.pmCapacity;
    entity.pdCapacity = domain.pdCapacity;
    entity.feCapacity = domain.feCapacity;
    entity.beCapacity = domain.beCapacity;
    entity.idea = IdeaMapper.toEntity(domain.idea);
    entity.createdAt = domain.createdAt;
    return entity;
  }
}