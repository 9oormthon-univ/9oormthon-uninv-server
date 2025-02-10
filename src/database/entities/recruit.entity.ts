import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recruits')
export class Recruit {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'type' })
  type: number; // 0: 유니브 대표 모집, 1: 미르미 모집, 2: etc.

  @Column({ name: 'title' }) // ex) 유니브 대표 모집, 미르미 모집, etc.
  title: string;

  @Column({
    name: 'start_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startAt: Date;

  @Column({
    name: 'end_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  endAt: Date;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
