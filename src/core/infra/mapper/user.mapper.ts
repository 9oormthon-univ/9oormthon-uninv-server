import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../../../user/domain/user.model';
import { UnivMapper } from './univ.mapper';

export class UserMapper {
  static toDomain(entity: UserEntity): UserModel {
    return new UserModel(
      entity.id,
      entity.serialId,
      entity.password,
      entity.imgUrl,
      entity.name,
      entity.phoneNumber,
      entity.introduction,
      entity.generations,
      entity.stacks,
      entity.links,
      entity.refreshToken,
      entity.role,
      entity.univ ? UnivMapper.toDomain(entity.univ) : null,
      entity.createdAt,
    );
  }

  static toEntity(domain: UserModel): UserEntity {
    const entity = new UserEntity();
    entity.id = domain.id;
    entity.serialId = domain.serialId;
    entity.password = domain.password;
    entity.imgUrl = domain.imgUrl;
    entity.name = domain.name;
    entity.phoneNumber = domain.phoneNumber;
    entity.introduction = domain.introduction;
    entity.generations = domain.generations;
    entity.stacks = domain.stacks;
    entity.links = domain.links;
    entity.refreshToken = domain.refreshToken;
    entity.role = domain.role;

    if (domain.univ) {
      entity.univ = UnivMapper.toEntity(domain.univ);
    }
    entity.createdAt = domain.createdAt;
    return entity;
  }
}