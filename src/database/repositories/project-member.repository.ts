import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectMember } from '../entities/project-member.entity';

@Injectable()
export class ProjectMemberRepository extends Repository<ProjectMember> {}
