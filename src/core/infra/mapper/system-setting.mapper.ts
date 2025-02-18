import { SystemSettingEntity } from '../entities/system-setting.entity';
import { SystemSettingModel } from '../../../system-setting/domain/system-setting.model';

export class SystemSettingMapper {
  static toDomain(entity: SystemSettingEntity): SystemSettingModel {
    return new SystemSettingModel(
      entity.id,
      entity.ideaSubmissionStart,
      entity.ideaSubmissionEnd,
      entity.phase1TeamBuildingStart,
      entity.phase1TeamBuildingEnd,
      entity.phase1ConfirmationStart,
      entity.phase1ConfirmationEnd,
      entity.phase2TeamBuildingStart,
      entity.phase2TeamBuildingEnd,
      entity.phase2ConfirmationStart,
      entity.phase2ConfirmationEnd,
      entity.phase3TeamBuildingStart,
      entity.phase3TeamBuildingEnd,
      entity.phase3ConfirmationStart,
      entity.phase3ConfirmationEnd,
      entity.maxPreferencesPerUser,
      entity.createdAt,
      entity.updatedAt
    );
  }

  static toEntity(domain: SystemSettingModel): SystemSettingEntity {
    const entity = new SystemSettingEntity();
    entity.id = domain.id;
    entity.ideaSubmissionStart = domain.ideaSubmissionStart;
    entity.ideaSubmissionEnd = domain.ideaSubmissionEnd;
    entity.phase1TeamBuildingStart = domain.phase1TeamBuildingStart;
    entity.phase1TeamBuildingEnd = domain.phase1TeamBuildingEnd;
    entity.phase1ConfirmationStart = domain.phase1ConfirmationStart;
    entity.phase1ConfirmationEnd = domain.phase1ConfirmationEnd;
    entity.phase2TeamBuildingStart = domain.phase2TeamBuildingStart;
    entity.phase2TeamBuildingEnd = domain.phase2TeamBuildingEnd;
    entity.phase2ConfirmationStart = domain.phase2ConfirmationStart;
    entity.phase2ConfirmationEnd = domain.phase2ConfirmationEnd;
    entity.phase3TeamBuildingStart = domain.phase3TeamBuildingStart;
    entity.phase3TeamBuildingEnd = domain.phase3TeamBuildingEnd;
    entity.phase3ConfirmationStart = domain.phase3ConfirmationStart;
    entity.phase3ConfirmationEnd = domain.phase3ConfirmationEnd;
    entity.maxPreferencesPerUser = domain.maxPreferencesPerUser;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
}