import { EntityManager } from 'typeorm';
import { SystemSettingModel } from '../domain/system-setting.model';

export interface SystemSettingRepository {
  findFirst(manager?: EntityManager): Promise<SystemSettingModel>;
}