import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { IdeaSubject } from '../entities/idea-subject.entity';

@Injectable()
export class IdeaSubjectRepository extends Repository<IdeaSubject> {}
