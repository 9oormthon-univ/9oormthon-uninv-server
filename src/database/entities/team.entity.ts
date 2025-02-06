import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Idea } from './idea.entity';

@Entity('teams')
export class Team {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: ' id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'number', nullable: true })
  number: number;

  @Column({ name: 'pm_capacity', nullable: false })
  pmCapacity: number;

  @Column({ name: 'pd_capacity', nullable: false })
  pdCapacity: number;

  @Column({ name: 'fe_capacity', nullable: false })
  feCapacity: number;

  @Column({ name: 'be_capacity', nullable: false })
  beCapacity: number;

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => Idea)
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

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
