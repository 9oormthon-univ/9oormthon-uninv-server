import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LegacyProjectMember } from '../entities/legacy-project-member.entity';

@Injectable()
export class LegacyProjectMemberRepository extends Repository<LegacyProjectMember> {}
