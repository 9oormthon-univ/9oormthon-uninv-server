import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity('projects')
export class Project {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  content: string;

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
  @OneToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;

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
