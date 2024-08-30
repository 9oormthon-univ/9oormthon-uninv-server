import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Univ {
  @PrimaryGeneratedColumn({ name: 'univ_id' })
  id: number;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'instagram_url' })
  instagramUrl: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
