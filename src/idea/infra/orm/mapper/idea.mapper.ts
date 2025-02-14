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
      entity.pmRequirement,
      entity.pmRequiredTechStacks,
      entity.pdRequirement,
      entity.pdRequiredTechStacks,
      entity.feRequirement,
      entity.feRequiredTechStacks,
      entity.beRequirement,
      entity.beRequiredTechStacks,
      UserMapper.toDomain(entity.provider),
      IdeaSubjectMapper.toDomain(entity.ideaSubject),
      entity.createdAt
    );
  }

  static toDomains(entities: IdeaEntity[]): IdeaModel[] {
    return entities.map(entity => this.toDomain(entity));
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
    entity.pmRequirement = domain.pmRequirement;
    entity.pmRequiredTechStacks = domain.pmRequiredTechStacks;
    entity.pdRequirement = domain.pdRequirement;
    entity.pdRequiredTechStacks = domain.pdRequiredTechStacks;
    entity.feRequirement = domain.feRequirement;
    entity.feRequiredTechStacks = domain.feRequiredTechStacks;
    entity.beRequirement = domain.beRequirement;
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
