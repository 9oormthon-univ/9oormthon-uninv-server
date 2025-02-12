import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../core/infra/entities/project.entity';

@Injectable()
export class ProjectRepository extends Repository<ProjectEntity> {}
