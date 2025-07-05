import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SystemSettingEntity } from '../../core/infra/entities/system-setting.entity';

@Injectable()
export class SystemSettingInitializer implements OnModuleInit {
  private readonly logger = new Logger(SystemSettingInitializer.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    const repo = this.dataSource.getRepository(SystemSettingEntity);
    const count = await repo.count();

    if (count === 0) {
      this.logger.log('No SystemSetting found. Creating default settings...');

      const defaultSetting = new SystemSettingEntity();

      // 아이디어 등록 기간: 2025년 2월 24일 00:00:00 ~ 2025년 3월 2일 23:59:59
      defaultSetting.ideaSubmissionStart = new Date("2025-02-24T00:00:00");
      defaultSetting.ideaSubmissionEnd   = new Date("2025-03-02T23:59:59");

      // 1차 팀빌딩 기간: 2025년 3월 3일 00:00:00 ~ 2025년 3월 7일 23:59:59
      defaultSetting.phase1TeamBuildingStart = new Date("2025-03-03T00:00:00");
      defaultSetting.phase1TeamBuildingEnd   = new Date("2025-03-07T23:59:59");

      // 1차 팀빌딩 확정 기간: 2025년 3월 8일 00:00:00 ~ 2025년 3월 9일 23:59:59
      defaultSetting.phase1ConfirmationStart = new Date("2025-03-08T00:00:00");
      defaultSetting.phase1ConfirmationEnd   = new Date("2025-03-09T23:59:59");

      // 2차 팀빌딩 기간: 2025년 3월 10일 00:00:00 ~ 2025년 3월 14일 23:59:59
      defaultSetting.phase2TeamBuildingStart = new Date("2025-03-10T00:00:00");
      defaultSetting.phase2TeamBuildingEnd   = new Date("2025-03-14T23:59:59");

      // 2차 팀빌딩 확정 기간: 2025년 3월 15일 00:00:00 ~ 2025년 3월 16일 23:59:59
      defaultSetting.phase2ConfirmationStart = new Date("2025-03-15T00:00:00");
      defaultSetting.phase2ConfirmationEnd   = new Date("2025-03-16T23:59:59");

      // 3차 팀빌딩 기간: 2025년 3월 17일 00:00:00 ~ 2025년 3월 21일 23:59:59
      defaultSetting.phase3TeamBuildingStart = new Date("2025-03-17T00:00:00");
      defaultSetting.phase3TeamBuildingEnd   = new Date("2025-03-21T23:59:59");

      // 3차 팀빌딩 확정 기간: 2025년 3월 22일 00:00:00 ~ 2025년 3월 23일 23:59:59
      defaultSetting.phase3ConfirmationStart = new Date("2025-03-22T00:00:00");
      defaultSetting.phase3ConfirmationEnd   = new Date("2025-03-23T23:59:59");

      // 해커톤 기간: 2025년 3월 24일 00:00:00 ~ 2025년 5월 31일 23:59:59
      defaultSetting.hackathonStart = new Date("2025-03-24T00:00:00");
      defaultSetting.hackathonEnd   = new Date("2025-05-31T23:59:59");

      // 사용자당 지원 가능한 지망 개수
      defaultSetting.maxPreferencesPerUser = 3;

      await repo.save(defaultSetting);
      this.logger.log('Default SystemSetting created.');
    } else {
      this.logger.log('SystemSetting already exists.');
    }
  }
}
