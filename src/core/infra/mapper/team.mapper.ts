import { TeamEntity } from '../entities/team.entity';
import { TeamModel } from '../../../team/domain/team.model';
import { IdeaMapper } from './idea.mapper';
import { MemberMapper } from './member.mapper';
import { ProjectMapper } from './project.mapper';

export class TeamMapper {
  static toDomain(entity:TeamEntity, options?: { skipMembers?: boolean, skipIdea: boolean }): TeamModel {
    return new TeamModel(
      entity.id,
      entity.name,
      entity.number,
      entity.generation,
      entity.pmCapacity,
      entity.pdCapacity,
      entity.feCapacity,
      entity.beCapacity,
      entity.status,
      options?.skipIdea
        ? null
        : IdeaMapper.toDomain(entity.idea),
      entity.project ? ProjectMapper.toDomain(entity.project, { skipTeam: true }) : null,
      options?.skipMembers
        ? []
        : (entity.members ?? []).map(member => MemberMapper.toDomain(member, { skipTeam: true })),
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
    entity.status = domain.status;
    entity.idea = domain.idea ? IdeaMapper.toEntity(domain.idea) : null;
    entity.project = domain.project ? ProjectMapper.toEntity(domain.project) : null;
    entity.createdAt = domain.createdAt;
    return entity;
  }
}