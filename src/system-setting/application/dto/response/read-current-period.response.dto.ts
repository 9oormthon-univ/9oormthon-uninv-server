import { EPeriod } from '../../../../core/enums/period.enum';
import { SystemSettingModel } from '../../../domain/system-setting.model';

/**
 * 날짜를 "yy.MM.dd" 형식으로 변환하는 헬퍼 함수
 */
function formatDate(date: Date): string {
  const yy = date.getFullYear().toString().slice(-2);
  const mm = ('0' + (date.getMonth() + 1)).slice(-2);
  const dd = ('0' + date.getDate()).slice(-2);
  return `${yy}.${mm}.${dd}`;
}

export class ReadCurrentPeriodResponseDto {
  idea_submission_period: string;
  phase1_period: string;
  phase1_team_building_period: string;
  phase1_confirmation_period: string;
  phase2_period: string;
  phase2_team_building_period: string;
  phase2_confirmation_period: string;
  phase3_period: string;
  phase3_team_building_period: string;
  phase3_confirmation_period: string;
  current_period: EPeriod;

  constructor(
    idea_submission_period: string,
    phase1_period: string,
    phase1_team_building_period: string,
    phase1_confirmation_period: string,
    phase2_period: string,
    phase2_team_building_period: string,
    phase2_confirmation_period: string,
    phase3_period: string,
    phase3_team_building_period: string,
    phase3_confirmation_period: string,
    current_period: EPeriod
  ) {
    this.idea_submission_period = idea_submission_period;
    this.phase1_period = phase1_period;
    this.phase1_team_building_period = phase1_team_building_period;
    this.phase1_confirmation_period = phase1_confirmation_period;
    this.phase2_period = phase2_period;
    this.phase2_team_building_period = phase2_team_building_period;
    this.phase2_confirmation_period = phase2_confirmation_period;
    this.phase3_period = phase3_period;
    this.phase3_team_building_period = phase3_team_building_period;
    this.phase3_confirmation_period = phase3_confirmation_period;
    this.current_period = current_period;
  }

  static from(systemSetting: SystemSettingModel): ReadCurrentPeriodResponseDto {
    return new ReadCurrentPeriodResponseDto(
      `${formatDate(systemSetting.ideaSubmissionStart)} ~ ${formatDate(systemSetting.ideaSubmissionEnd)}`,
      `${formatDate(systemSetting.phase1TeamBuildingStart)} ~ ${formatDate(systemSetting.phase1ConfirmationEnd)}`,
      `${formatDate(systemSetting.phase1TeamBuildingStart)} ~ ${formatDate(systemSetting.phase1TeamBuildingEnd)}`,
      `${formatDate(systemSetting.phase1ConfirmationStart)} ~ ${formatDate(systemSetting.phase1ConfirmationEnd)}`,
      `${formatDate(systemSetting.phase2TeamBuildingStart)} ~ ${formatDate(systemSetting.phase2ConfirmationEnd)}`,
      `${formatDate(systemSetting.phase2TeamBuildingStart)} ~ ${formatDate(systemSetting.phase2TeamBuildingEnd)}`,
      `${formatDate(systemSetting.phase2ConfirmationStart)} ~ ${formatDate(systemSetting.phase2ConfirmationEnd)}`,
      `${formatDate(systemSetting.phase3TeamBuildingStart)} ~ ${formatDate(systemSetting.phase3ConfirmationEnd)}`,
      `${formatDate(systemSetting.phase3TeamBuildingStart)} ~ ${formatDate(systemSetting.phase3TeamBuildingEnd)}`,
      `${formatDate(systemSetting.phase3ConfirmationStart)} ~ ${formatDate(systemSetting.phase3ConfirmationEnd)}`,
      systemSetting.getWhichPeriod()
    );
  }
}
