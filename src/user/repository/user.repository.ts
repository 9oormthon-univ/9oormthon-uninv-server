import { UserModel } from '../domain/user.model';
import { EntityManager } from 'typeorm';

export interface UserRepository {
  findById(id: number, manager? : EntityManager): Promise<UserModel | null>;
  findByIdWithUniv(id: number, manager? : EntityManager): Promise<UserModel | null>;
  findByPhoneNumberAndUniv(name: string, univId: number, manager? : EntityManager): Promise<UserModel | null>;
  findBySerialId(serialId: string, manager? : EntityManager): Promise<UserModel | null>;
  findByRefreshTokenAndId(refreshToken: string, id: number, manager? : EntityManager): Promise<UserModel | null>;
  findByIdAndRole(id: number, role: string, manager? : EntityManager): Promise<UserModel | null>;
  findByIdAndRefreshTokenAndRole(id: number, refreshToken: string, role: string, manager? : EntityManager): Promise<UserModel | null>;
  save(user: UserModel, manager? : EntityManager): Promise<void>;
  saveAll(users: UserModel[], manager? : EntityManager): Promise<void>;
  delete(id: number, manager? : EntityManager): Promise<void>;
}
