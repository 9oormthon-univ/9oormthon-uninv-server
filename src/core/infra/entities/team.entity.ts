import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IdeaEntity } from './idea.entity';
import { MemberEntity } from './member.entity';

@Entity('teams')
export class TeamEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'name', nullable: true })
  name: string;

  @Column({ name: 'number', nullable: true })
  number: number;

  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'pm_capacity', nullable: false })
  pmCapacity: number;

  @Column({ name: 'pd_capacity', nullable: false })
  pdCapacity: number;

  @Column({ name: 'fe_capacity', nullable: false })
  feCapacity: number;

  @Column({ name: 'be_capacity', nullable: false })
  beCapacity: number;

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @OneToOne(() => IdeaEntity)
  @JoinColumn({ name: 'idea_id' })
  idea: IdeaEntity;

  @OneToMany(() => MemberEntity, (member) => member.team)
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
