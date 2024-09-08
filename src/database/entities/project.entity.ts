import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Team } from './team.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ name: 'project_id' })
  id: number;

  @Column({ name: 'award', nullable: true })
  award: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'back_end_link', nullable: true })
  backendLink: string;

  @Column({ name: 'front_end_link', nullable: true })
  frontendLink: string;

  @Column({ name: 'release_link', nullable: true })
  releaseLink: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @ManyToOne(() => Team, { nullable: true })
  @JoinColumn({ name: 'team_id' })
  team: Team;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
