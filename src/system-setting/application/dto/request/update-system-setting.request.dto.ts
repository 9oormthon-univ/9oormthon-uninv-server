import { IsNotEmpty } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class UpdateSystemSettingRequestDto {
  @IsNotEmpty({ message: '아이디어 제출 시작일을 입력해주세요' })
  @Expose({ name: 'idea_submission_start'})
  @Type(() => Date)
  ideaSubmissionStart: Date;

  @IsNotEmpty({ message: '아이디어 제출 마감일을 입력해주세요' })
  @Expose({ name: 'idea_submission_end'})
  @Type(() => Date)
  ideaSubmissionEnd: Date;

  @IsNotEmpty({ message: '1차 팀빌딩 시작일을 입력해주세요' })
  @Expose({ name: 'phase1_team_building_start'})
  @Type(() => Date)
  phase1TeamBuildingStart: Date;

  @IsNotEmpty({ message: '1차 팀빌딩 마감일을 입력해주세요' })
  @Expose({ name: 'phase1_team_building_end'})
  @Type(() => Date)
  phase1TeamBuildingEnd: Date;

  @IsNotEmpty({ message: '1차 팀빌딩 확정 시작일을 입력해주세요' })
  @Expose({ name: 'phase1_confirmation_start'})
  @Type(() => Date)
  phase1ConfirmationStart: Date;

  @IsNotEmpty({ message: '1차 팀빌딩 확정 마감일을 입력해주세요' })
  @Expose({ name: 'phase1_confirmation_end'})
  @Type(() => Date)
  phase1ConfirmationEnd: Date;

  @IsNotEmpty({ message: '2차 팀빌딩 시작일을 입력해주세요' })
  @Expose({ name: 'phase2_team_building_start'})
  @Type(() => Date)
  phase2TeamBuildingStart: Date;

  @IsNotEmpty({ message: '2차 팀빌딩 마감일을 입력해주세요' })
  @Expose({ name: 'phase2_team_building_end'})
  @Type(() => Date)
  phase2TeamBuildingEnd: Date;

  @IsNotEmpty({ message: '2차 팀빌딩 확정 시작일을 입력해주세요' })
  @Expose({ name: 'phase2_confirmation_start'})
  @Type(() => Date)
  phase2ConfirmationStart: Date;

  @IsNotEmpty({ message: '2차 팀빌딩 확정 마감일을 입력해주세요' })
  @Expose({ name: 'phase2_confirmation_end'})
  @Type(() => Date)
  phase2ConfirmationEnd: Date;

  @IsNotEmpty({ message: '3차 팀빌딩 시작일을 입력해주세요' })
  @Expose({ name: 'phase3_team_building_start'})
  @Type(() => Date)
  phase3TeamBuildingStart: Date;

  @IsNotEmpty({ message: '3차 팀빌딩 마감일을 입력해주세요' })
  @Expose({ name: 'phase3_team_building_end'})
  @Type(() => Date)
  phase3TeamBuildingEnd: Date;

  @IsNotEmpty({ message: '3차 팀빌딩 확정 시작일을 입력해주세요' })
  @Expose({ name: 'phase3_confirmation_start'})
  @Type(() => Date)
  phase3ConfirmationStart: Date;

  @IsNotEmpty({ message: '3차 팀빌딩 확정 마감일을 입력해주세요' })
  @Expose({ name: 'phase3_confirmation_end'})
  @Type(() => Date)
  phase3ConfirmationEnd: Date;

  @IsNotEmpty({ message: '해커톤 시작일을 입력해주세요' })
  @Expose({ name: 'hackathon_start'})
  @Type(() => Date)
  hackathonStart: Date;

  @IsNotEmpty({ message: '해커톤 마감일을 입력해주세요' })
  @Expose({ name: 'hackathon_end'})
  @Type(() => Date)
  hackathonEnd: Date;
}