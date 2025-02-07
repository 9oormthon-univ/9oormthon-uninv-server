import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Univ } from './univ.entity';
import { ESecurityRole } from '../enums/security-role.enum';

@Entity('users')
export class User {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ------- Unique Column ------- */
  /* ----------------------------- */
  @Column({ name: 'serial_id', nullable: false })
  serialId: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'img_url', nullable: true })
  imgUrl: string;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'phone_number', nullable: false })
  phoneNumber: string;

  @Column({
    name: 'introduction',
    type: 'text',
    nullable: true,
  })
  introduction: string;

  @Column('simple-array', { name: 'generations', nullable: false })
  generations: string[];

  @Column('simple-array', { name: 'stacks', nullable: true })
  stacks: string[];

  @Column('simple-array', { name: 'links', nullable: true })
  links: string[];

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string | null;

  @Column({
    type: 'enum',
    enum: ESecurityRole,
    default: ESecurityRole.USER,
  })
  role: ESecurityRole;

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => Univ, { nullable: true })
  @JoinColumn({ name: 'univ_id' })
  univ: Univ;

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
