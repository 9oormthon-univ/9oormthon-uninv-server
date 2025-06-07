import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UnivEntity } from './univ.entity';
import { ESecurityRole } from '../../enums/security-role.enum';
import { LinkEntity } from './link.entity';
import { MemberEntity } from './member.entity';

@Entity('users')
export class
UserEntity {
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

  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber: string;

  @Column({
    name: 'introduction',
    type: 'text',
    nullable: true,
  })
  introduction: string;

  @Column('simple-array', { name: 'generations', nullable: true })
  generations: string[];

  @Column('simple-array', { name: 'stacks', nullable: true })
  stacks: string[];

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string | null;

  @Column({
    type: 'enum',
    enum: ESecurityRole,
    default: ESecurityRole.USER,
  })
  role: ESecurityRole;

  /* ----------------------------- */
  /* ----- Many To One Column ---- */
  /* ----------------------------- */
  @ManyToOne(() => UnivEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'univ_id' })
  univ: UnivEntity;

  /* ----------------------------- */
  /* ---- One To Many Column ----- */
  /* ----------------------------- */
  @OneToMany(() => LinkEntity, (link) => link.user)
  links: LinkEntity[];

  @OneToMany(() => MemberEntity, (member) => member.user)
  members: MemberEntity[];

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
