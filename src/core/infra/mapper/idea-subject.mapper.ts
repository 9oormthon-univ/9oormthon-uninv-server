import { IdeaSubjectEntity } from '../entities/idea-subject.entity';
import { IdeaSubjectModel } from '../../../idea/domain/idea-subject.model';

export class IdeaSubjectMapper {

  static toDomain(entity: IdeaSubjectEntity): IdeaSubjectModel {
    return new IdeaSubjectModel(
      entity.id,
      entity.generation,
      entity.name,
    );
  }

  static toDomains(entities: IdeaSubjectEntity[]): IdeaSubjectModel[] {
    return entities.map(entity => this.toDomain(entity));
  }

  static toEntity(domain: IdeaSubjectModel): IdeaSubjectEntity {
    const entity = new IdeaSubjectEntity();
    entity.id = domain.id;
    entity.generation = domain.generation;
    entity.name = domain.name;
    return entity;
  }
}