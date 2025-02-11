import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaSubjectEntity } from '../../core/database/entities/idea-subject.entity';

@Injectable()
export class IdeaSubjectRepository extends Repository<IdeaSubjectEntity> {}
