import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BookmarkEntity } from './bookmark.entity';
import { IdeaEntity } from './idea.entity';

@Entity('idea_subjects')
export class IdeaSubjectEntity {
  /* ----------------------------- */
  /* ------- Default Column ------ */
  /* ----------------------------- */
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  /* ----------------------------- */
  /* ---- Information Column ----- */
  /* ----------------------------- */
  @Column({ name: 'generation', type: 'int', nullable: false })
  generation: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  /* ----------------------------- */
  /* ---- One To Many Column ----- */
  /* ----------------------------- */
  @OneToMany(() => IdeaEntity, (idea) => idea.ideaSubject)
  ideas: IdeaEntity[];
}
