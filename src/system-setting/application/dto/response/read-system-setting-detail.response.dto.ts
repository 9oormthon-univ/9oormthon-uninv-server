import { SystemSettingModel } from '../../../domain/system-setting.model';

export class ReadSystemSettingDetailResponseDto {
  idea_submission_start: string;
  idea_submission_end: string;
  phase1_team_building_start: string;
  phase1_team_building_end: string;
  phase1_confirmation_start: string;
  phase1_confirmation_end: string;
  phase2_team_building_start: string;
  phase2_team_building_end: string;
  phase2_confirmation_start: string;
  phase2_confirmation_end: string;
  phase3_team_building_start: string;
  phase3_team_building_end: string;
  phase3_confirmation_start: string;
  phase3_confirmation_end: string;

  constructor(
    idea_submission_start: string,
    idea_submission_end: string,
    phase1_team_building_start: string,
    phase1_team_building_end: string,
    phase1_confirmation_start: string,
    phase1_confirmation_end: string,
    phase2_team_building_start: string,
    phase2_team_building_end: string,
    phase2_confirmation_start: string,
    phase2_confirmation_end: string,
    phase3_team_building_start: string,
    phase3_team_building_end: string,
    phase3_confirmation_start: string,
    phase3_confirmation_end: string
  ) {
    this.idea_submission_start = idea_submission_start;
    this.idea_submission_end = idea_submission_end;
    this.phase1_team_building_start = phase1_team_building_start;
    this.phase1_team_building_end = phase1_team_building_end;
    this.phase1_confirmation_start = phase1_confirmation_start;
    this.phase1_confirmation_end = phase1_confirmation_end;
    this.phase2_team_building_start = phase2_team_building_start;
    this.phase2_team_building_end = phase2_team_building_end;
    this.phase2_confirmation_start = phase2_confirmation_start;
    this.phase2_confirmation_end = phase2_confirmation_end;
    this.phase3_team_building_start = phase3_team_building_start;
    this.phase3_team_building_end = phase3_team_building_end;
    this.phase3_confirmation_start = phase3_confirmation_start;
    this.phase3_confirmation_end = phase3_confirmation_end;
  }

  static formatDate(date: Date): string {
    // padStart로 두자리 보장
    const yyyy = date.getFullYear();
    const MM = (date.getMonth() + 1).toString().padStart(2, '0');
    const dd = date.getDate().toString().padStart(2, '0');
    const HH = date.getHours().toString().padStart(2, '0');
    const mm = date.getMinutes().toString().padStart(2, '0');
    const ss = date.getSeconds().toString().padStart(2, '0');
    return `${yyyy}-${MM}-${dd}T${HH}:${mm}:${ss}`;
  }

  static from(systemSetting: SystemSettingModel): ReadSystemSettingDetailResponseDto {
    return new ReadSystemSettingDetailResponseDto(
      this.formatDate(systemSetting.ideaSubmissionStart),
      this.formatDate(systemSetting.ideaSubmissionEnd),
      this.formatDate(systemSetting.phase1TeamBuildingStart),
      this.formatDate(systemSetting.phase1TeamBuildingEnd),
      this.formatDate(systemSetting.phase1ConfirmationStart),
      this.formatDate(systemSetting.phase1ConfirmationEnd),
      this.formatDate(systemSetting.phase2TeamBuildingStart),
      this.formatDate(systemSetting.phase2TeamBuildingEnd),
      this.formatDate(systemSetting.phase2ConfirmationStart),
      this.formatDate(systemSetting.phase2ConfirmationEnd),
      this.formatDate(systemSetting.phase3TeamBuildingStart),
      this.formatDate(systemSetting.phase3TeamBuildingEnd),
      this.formatDate(systemSetting.phase3ConfirmationStart),
      this.formatDate(systemSetting.phase3ConfirmationEnd)
    );
  }
}
