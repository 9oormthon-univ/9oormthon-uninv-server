import {
  Column,
  Entity,
  JoinColumn, ManyToOne, OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IdeaSubjectEntity } from './idea-subject.entity';
import { BookmarkEntity } from './bookmark.entity';

@Entity('ideas')
export class IdeaEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'summary', nullable: false })
  summary: string;

  @Column({
    name: 'content',
    type: 'text',
    nullable: false,
  })
  content: string;

  @Column({ name: 'generation', nullable: false })
  generation: number;

  @Column({ name: 'pm_requirements', nullable: true })
  pmRequirements: string;

  @Column('simple-array', { name: 'pm_required_tech_stacks', nullable: true })
  pmRequiredTechStacks: string[];

  @Column({ name: 'pd_requirements', nullable: true })
  pdRequirements: string;

  @Column('simple-array', { name: 'pd_required_tech_stacks', nullable: true })
  pdRequiredTechStacks: string[];

  @Column({ name: 'fe_requirements', nullable: true })
  feRequirements: string;

  @Column('simple-array', { name: 'fe_required_tech_stacks', nullable: true })
  feRequiredTechStacks: string[];

  @Column({ name: 'be_requirements', nullable: true })
  beRequirements: string;

  @Column('simple-array', { name: 'be_required_tech_stacks', nullable: true })
  beRequiredTechStacks: string[];

  /* ----------------------------- */
  /* ----- One To One Column ----- */
  /* ----------------------------- */
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'provider_id' })
  provider: UserEntity;

  /* ----------------------------- */
  /* ---- Many To One Column ----- */
  /* ----------------------------- */
  @ManyToOne(() => IdeaSubjectEntity)
  @JoinColumn({ name: 'idea_subject_id' })
  ideaSubject: IdeaSubjectEntity;

  /* ----------------------------- */
  /* ---- One To Many Column ----- */
  /* ----------------------------- */
  @OneToMany(() => BookmarkEntity, (bookmark) => bookmark.idea)
  bookmarks: BookmarkEntity[];

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
