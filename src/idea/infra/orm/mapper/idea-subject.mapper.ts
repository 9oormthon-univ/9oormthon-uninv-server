import { IdeaSubjectEntity } from '../../../../core/database/entities/idea-subject.entity';
import { IdeaSubjectModel } from '../../../domain/idea-subject.model';

export class IdeaSubjectMapper {

  static toDomain(entity: IdeaSubjectEntity): IdeaSubjectModel {
    return new IdeaSubjectModel(
      entity.id,
      entity.name,
      entity.isActive
    );
  }

  static toEntity(domain: IdeaSubjectModel): IdeaSubjectEntity {
    const entity = new IdeaSubjectEntity();
    entity.id = domain.id;
    entity.name = domain.name;
    entity.isActive = domain.isActive;
    return entity;
  }
}