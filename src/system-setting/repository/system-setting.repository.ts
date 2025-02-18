import { DataSource, EntityManager } from 'typeorm';
import { SystemSettingModel } from '../domain/system-setting.model';
import { SystemSettingMapper } from '../../core/infra/mapper/system-setting.mapper';
import { SystemSettingEntity } from '../../core/infra/entities/system-setting.entity';

export class SystemSettingRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findFirst(manager?: EntityManager): Promise<SystemSettingModel> {
    const repo = manager ? manager.getRepository(SystemSettingEntity) : this.dataSource.getRepository(SystemSettingEntity);

    const entities = await repo.find();

    return SystemSettingMapper.toDomain(entities[0]);
  }
}