import { MemberEntity } from '../entities/member.entity';
import { MemberModel } from '../../../team/domain/member.model';
import { TeamMapper } from './team.mapper';
import { UserMapper } from './user.mapper';
import { TeamModel } from '../../../team/domain/team.model';

export class MemberMapper {
  static toDomain(entity: MemberEntity, options?: { skipTeam?: boolean }): MemberModel {
    return new MemberModel(
      entity.id,
      entity.role,
      UserMapper.toDomain(entity.user),
      options?.skipTeam
        ? ({ id: entity.team.id } as TeamModel)
        : TeamMapper.toDomain(entity.team, { skipMembers: true }),
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