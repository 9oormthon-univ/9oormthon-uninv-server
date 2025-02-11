import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { LegacyProjectMemberEntity } from '../../core/database/entities/legacy-project-member.entity';

@Injectable()
export class LegacyProjectMemberRepository extends Repository<LegacyProjectMemberEntity> {}
