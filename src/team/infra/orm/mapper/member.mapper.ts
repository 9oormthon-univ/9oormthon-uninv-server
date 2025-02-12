import { MemberEntity } from '../../../../core/infra/entities/member.entity';
import { MemberModel } from '../../../domain/member.model';
import { TeamMapper } from './team.mapper';
import { UserMapper } from '../../../../user/infra/orm/mapper/user.mapper';

export class MemberMapper {
  static toDomain(entity: MemberEntity): MemberModel {
    return new MemberModel(
      entity.id,
      entity.role,
      UserMapper.toDomain(entity.user),
      TeamMapper.toDomain(entity.team),
      entity.createdAt
    );
  }

  static toEntity(domain: MemberModel): MemberEntity {
    const entity = new MemberEntity();
    entity.id = domain.id;
    entity.role = domain.role;
    entity.user = UserMapper.toEntity(domain.user);
    entity.team = TeamMapper.toEntity(domain.team);
    entity.createdAt = domain.createdAt;
    return entity;
  }
}