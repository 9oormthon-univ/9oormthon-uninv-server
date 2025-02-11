import { ProjectEntity } from '../../../../core/database/entities/project.entity';
import { ProjectModel } from '../../../domain/project.model';
import { TeamMapper } from './team.mapper';

export class ProjectMapper {
  static toDomain(entity:ProjectEntity):ProjectModel {
    return new ProjectModel(
      entity.id,
      entity.name,
      entity.content,
      entity.generation,
      entity.award,
      entity.backendLink,
      entity.frontendLink,
      entity.releaseLink,
      entity.imgUrl,
      TeamMapper.toDomain(entity.team),
      entity.createdAt
    );
  }

  static toEntity(domain: ProjectModel): ProjectEntity {
    const entity = new ProjectEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.content = domain.content;
    entity.generation = domain.generation;
    entity.award = domain.award;
    entity.backendLink = domain.backendLink;
    entity.frontendLink = domain.frontendLink;
    entity.releaseLink = domain.releaseLink;
    entity.imgUrl = domain.imgUrl;
    entity.team = TeamMapper.toEntity(domain.team);
    entity.createdAt = domain.createdAt;
    return entity;
  }
}