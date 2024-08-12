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

  @Column({ nullable: true })
  award: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  backendLink: string;

  @Column({ nullable: true })
  frontendLink: string;

  @Column({ nullable: true })
  releaseLink: string;

  @Column({ nullable: true })
  image_url: string;

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
