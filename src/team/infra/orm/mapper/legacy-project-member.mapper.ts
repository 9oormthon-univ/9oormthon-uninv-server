import { LegacyProjectMemberEntity } from '../../../../core/infra/entities/legacy-project-member.entity';
import { LegacyProjectMemberModel } from '../../../domain/legacy-project-member.model';
import { ProjectMapper } from './project.mapper';

export class LegacyProjectMemberMapper {
  static toDomain(entity: LegacyProjectMemberEntity): LegacyProjectMemberModel {
    return new LegacyProjectMemberModel(
      entity.id,
      entity.name,
      entity.role,
      ProjectMapper.toDomain(entity.project),
      entity.createdAt
    );
  }

  static toEntity(domain: LegacyProjectMemberModel): LegacyProjectMemberEntity {
    const entity = new LegacyProjectMemberEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.role = domain.role;
    entity.project = ProjectMapper.toEntity(domain.project);
    entity.createdAt = domain.createdAt;
    return entity;
  }
}