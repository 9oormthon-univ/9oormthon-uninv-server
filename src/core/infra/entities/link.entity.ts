import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ELinkType } from '../../enums/link-type.enum';
import { UserEntity } from './user.entity';

@Entity('links')
export class LinkEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'type', type: 'enum', enum: ELinkType, nullable: false })
  type: ELinkType;

  @Column({ name: 'url', nullable: false })
  url: string;

  /* ----------------------------- */
  /* ---- Many To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

}