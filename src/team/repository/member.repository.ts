import { MemberModel } from '../domain/member.model';
import { EntityManager } from 'typeorm';

export interface MemberRepository {
  save(member: MemberModel, manager? : EntityManager) : Promise<void>;
}