import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettingEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'idea_submission_start', type: 'timestamp' })
  ideaSubmissionStart: Date;

  @Column({ name: 'idea_submission_end', type: 'timestamp' })
  ideaSubmissionEnd: Date;

  @Column({ name: 'phase1_team_building_start', type: 'timestamp' })
  phase1TeamBuildingStart: Date;

  @Column({ name: 'phase1_team_building_end', type: 'timestamp' })
  phase1TeamBuildingEnd: Date;

  @Column({ name: 'phase1_confirmation_start', type: 'timestamp' })
  phase1ConfirmationStart: Date;

  @Column({ name: 'phase1_confirmation_end', type: 'timestamp' })
  phase1ConfirmationEnd: Date;

  @Column({ name: 'phase2_team_building_start', type: 'timestamp' })
  phase2TeamBuildingStart: Date;

  @Column({ name: 'phase2_team_building_end', type: 'timestamp' })
  phase2TeamBuildingEnd: Date;

  @Column({ name: 'phase2_confirmation_start', type: 'timestamp' })
  phase2ConfirmationStart: Date;

  @Column({ name: 'phase2_confirmation_end', type: 'timestamp' })
  phase2ConfirmationEnd: Date;

  @Column({ name: 'phase3_team_building_start', type: 'timestamp' })
  phase3TeamBuildingStart: Date;

  @Column({ name: 'phase3_team_building_end', type: 'timestamp' })
  phase3TeamBuildingEnd: Date;

  @Column({ name: 'phase3_confirmation_start', type: 'timestamp' })
  phase3ConfirmationStart: Date;

  @Column({ name: 'phase3_confirmation_end', type: 'timestamp' })
  phase3ConfirmationEnd: Date;

  @Column({ name: 'max_preferences_per_user', type: 'int' })
  maxPreferencesPerUser: number;

  /* ----------------------------- */
  /* ---- TimeStamp Column ------- */
  /* ----------------------------- */
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

}