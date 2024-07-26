import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  award: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ nullable: true })
  backendLink: string;

  @Column({ nullable: true })
  frontendLink: string;

  @Column({ nullable: true })
  releaseLink: string;

  @Column({ nullable: true })
  image: string;

  @Column()
  pm: string;

  @Column()
  design: string;

  @Column('text', { array: true })
  frontend: string[];

  @Column('text', { array: true })
  backend: string[];
}
