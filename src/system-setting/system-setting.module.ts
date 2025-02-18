import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { SystemSettingEntity } from '../core/infra/entities/system-setting.entity';
import { SystemSettingQueryV1Controller } from './controller/query/system-setting-query-v1.controller';
import { SystemSettingCommandV1Controller } from './controller/command/system-setting-command-v1.controller';
import { SystemSettingRepository } from './repository/system-setting.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature(
      [SystemSettingEntity]
    ),
  ],
  controllers: [
    SystemSettingQueryV1Controller,
    SystemSettingCommandV1Controller
  ],
  providers: [
    SystemSettingRepository
  ],

  exports: [
    SystemSettingRepository
  ]
})
export class SystemSettingModule {}
