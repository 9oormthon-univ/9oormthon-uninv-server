import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TeamEntity } from './team.entity';

@Entity('projects')
export class ProjectEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'award', nullable: true })
  award: string;

  @Column({ name: 'back_end_link', nullable: true })
  backendLink: string;

  @Column({ name: 'front_end_link', nullable: true })
  frontendLink: string;

  @Column({ name: 'release_link', nullable: true })
  releaseLink: string;

  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @OneToOne(() => TeamEntity, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: TeamEntity;

  /* ----------------------------- */
  /* ---- TimeStamp Column ------- */
  /* ----------------------------- */
  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
