import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../core/infra/database.module';
import { SystemSettingEntity } from '../core/infra/entities/system-setting.entity';
import { SystemSettingQueryV1Controller } from './controller/query/system-setting-query-v1.controller';
import { AdminSystemSettingCommandV1Controller } from './controller/command/admin-system-setting-command-v1.controller';
import { SystemSettingRepository } from './repository/system-setting.repository';
import { UserModule } from '../user/user.module';
import { ReadCurrentPeriodService } from './application/service/read-current-period.service';
import { SystemSettingInitializer } from './initializer/system-setting.initializer';
import { UpdateSystemSettingService } from './application/service/update-system-setting.service';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TypeOrmModule.forFeature(
      [SystemSettingEntity]
    ),
  ],
  controllers: [
    SystemSettingQueryV1Controller,
    AdminSystemSettingCommandV1Controller
  ],
  providers: [
    SystemSettingRepository,
    ReadCurrentPeriodService,
    UpdateSystemSettingService,
    SystemSettingInitializer
  ],

  exports: [
    SystemSettingRepository
  ]
})
export class SystemSettingModule {}
