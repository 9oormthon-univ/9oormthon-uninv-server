import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Univ } from './univ.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column({ name: 'serial_id' })
  serialId: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'is_login', type: 'boolean', default: false })
  isLogin: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string | null;

  @Column({ name: 'name', nullable: true })
  name: string;

  @ManyToOne(() => Univ, { nullable: true })
  @JoinColumn({ name: 'univ_id' })
  univ: Univ;

  @Column({ name: 'github_link', nullable: true })
  githubLink: string;

  @Column({ name: 'instagram_link', nullable: true })
  instagramLink: string;

  @Column({ name: 'blog_link', nullable: true })
  blogLink: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
