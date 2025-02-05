import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('univs')
export class Univ {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'instagram_url', nullable: true })
  instagramUrl: string;

  @Column({ name: 'img_url', nullable: false })
  imgUrl: string;

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
