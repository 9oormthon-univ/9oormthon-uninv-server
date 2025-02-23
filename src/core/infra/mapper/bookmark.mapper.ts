import { BookmarkEntity } from '../entities/bookmark.entity';
import { BookmarkModel } from '../../../idea/domain/bookmark.model';
import { UserMapper } from './user.mapper';
import { IdeaMapper } from './idea.mapper';

export class BookmarkMapper {
  static toDomain(entity: BookmarkEntity): BookmarkModel {
    return new BookmarkModel(
      entity.id,
      UserMapper.toDomain(entity.user),
      IdeaMapper.toDomain(entity.idea),
      entity.createdAt
    );
  }

  static toEntity(domain: BookmarkModel): BookmarkEntity {
    const entity = new BookmarkEntity();
    entity.id = domain.id;
    entity.user = UserMapper.toEntity(domain.user);
    entity.idea = IdeaMapper.toEntity(domain.idea);
    entity.createdAt = domain.createdAt;
    return entity;
  }
}