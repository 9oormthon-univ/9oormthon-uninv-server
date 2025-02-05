import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { IdeaSubject } from './idea-subject.entity';

@Entity('ideas')
export class Idea {
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

  @Column({ name: 'summary', nullable: false })
  summary: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({ name: 'pm_requirements', nullable: true })
  pmRequirements: string;

  @Column('simple-array', { name: 'pm_required_tech_stacks', nullable: true })
  pmRequiredTechStacks: string;

  @Column({ name: 'pd_requirements', nullable: true })
  pdRequirements: string;

  @Column('simple-array', { name: 'pd_required_tech_stacks', nullable: true })
  pdRequiredTechStacks: string;

  @Column({ name: 'fe_requirements', nullable: true })
  feRequirements: string;

  @Column('simple-array', { name: 'fe_required_tech_stacks', nullable: true })
  feRequiredTechStacks: string;

  @Column({ name: 'be_requirements', nullable: true })
  beRequirements: string;

  @Column('simple-array', { name: 'be_required_tech_stacks', nullable: true })
  beRequiredTechStacks: string;

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @OneToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @OneToOne(() => IdeaSubject)
  @JoinColumn({ name: 'idea_subject_id' })
  ideaSubject: IdeaSubject;

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
