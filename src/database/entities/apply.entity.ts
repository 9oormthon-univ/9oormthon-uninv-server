import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Idea } from './idea.entity';
import { EApplyStatus } from '../enums/apply-status.enum';
import { ERole } from '../enums/role.enum';

@Entity('applies')
export class Apply {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'phase', nullable: false })
  phase: number;

  @Column({ name: 'status', type: 'enum', enum: EApplyStatus, nullable: false })
  status: EApplyStatus;

  @Column({ name: 'preference', nullable: false})
  preference: number;

  @Column({ name: 'motivation', nullable: false})
  motivation: string;

  @Column({ name: 'role', type: 'enum', enum: ERole, nullable: false })
  role: ERole;

  /* ----------------------------- */
  /* ---- Many To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

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
