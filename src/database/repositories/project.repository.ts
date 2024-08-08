import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';

@Injectable()
export class ProjectRepository extends Repository<Project> {}
