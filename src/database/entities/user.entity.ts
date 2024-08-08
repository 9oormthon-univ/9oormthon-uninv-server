import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id' })
  id: number;

  @Column()
  name: string;

  @Column()
  role: string;

  @Column({ name: 'github_link' })
  githubLink: string;

  @Column({ name: 'instagram_link' })
  instagramLink: string;

  @Column({ name: 'blog_link' })
  blogLink: string;

  @Column({ name: 'serial_id' })
  serialId: string;

  @Column()
  password: string;

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
