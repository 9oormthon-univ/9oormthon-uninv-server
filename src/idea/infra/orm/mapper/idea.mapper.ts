import { IdeaEntity } from '../../../../core/infra/entities/idea.entity';
import { IdeaModel } from '../../../domain/idea.model';
import { UserMapper } from '../../../../user/infra/orm/mapper/user.mapper';
import { IdeaSubjectMapper } from './idea-subject.mapper';

export class IdeaMapper {
  /**
   * ORM 엔티티를 순수 도메인 모델로 변환
   */
  static toDomain(entity: IdeaEntity): IdeaModel {
    return new IdeaModel(
      entity.id,
      entity.title,
      entity.summary,
      entity.content,
      entity.generation,
      entity.pmRequirements,
      entity.pmRequiredTechStacks,
      entity.pdRequirements,
      entity.pdRequiredTechStacks,
      entity.feRequirements,
      entity.feRequiredTechStacks,
      entity.beRequirements,
      entity.beRequiredTechStacks,
      UserMapper.toDomain(entity.provider),
      IdeaSubjectMapper.toDomain(entity.ideaSubject),
      entity.createdAt
    );
  }

  /**
   * 순수 도메인 모델을 ORM 엔티티로 변환
   * (관계 엔티티는 필요에 따라 별도로 조회 및 할당)
   */
  static toEntity(domain: IdeaModel): IdeaEntity {
    const entity = new IdeaEntity();
    entity.id = domain.id;
    entity.title = domain.title;
    entity.summary = domain.summary;
    entity.content = domain.content;
    entity.generation = domain.generation;
    entity.pmRequirements = domain.pmRequirements;
    entity.pmRequiredTechStacks = domain.pmRequiredTechStacks;
    entity.pdRequirements = domain.pdRequirements;
    entity.pdRequiredTechStacks = domain.pdRequiredTechStacks;
    entity.feRequirements = domain.feRequirements;
    entity.feRequiredTechStacks = domain.feRequiredTechStacks;
    entity.beRequirements = domain.beRequirements;
    entity.beRequiredTechStacks = domain.beRequiredTechStacks;
    entity.createdAt = domain.createdAt;
    if (domain.provider) {
      entity.provider = UserMapper.toEntity(domain.provider);
    }
    if (domain.ideaSubject) {
      entity.ideaSubject = IdeaSubjectMapper.toEntity(domain.ideaSubject);
    }
    return entity;
  }
}
