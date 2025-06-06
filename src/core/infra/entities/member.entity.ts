import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ERole } from '../../enums/role.enum';
import { UserEntity } from './user.entity';
import { TeamEntity } from './team.entity';

@Entity('members')
export class MemberEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'role', type: 'enum', enum: ERole, nullable: false })
  role: ERole;

  @Column({ name: 'is_leader', type: 'boolean', default: false })
  isLeader: boolean;

  /* ----------------------------- */
  /* ---- Many To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => UserEntity, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => TeamEntity, { nullable: false, onDelete: 'CASCADE' })
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
