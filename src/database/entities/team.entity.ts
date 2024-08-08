import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Idea } from './idea.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn({ name: 'team_id' })
  id: number;

  @ManyToOne(() => Idea)
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

  @Column({ name: 'team_name' })
  teamName: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({ name: 'service_content' })
  serviceContent: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
