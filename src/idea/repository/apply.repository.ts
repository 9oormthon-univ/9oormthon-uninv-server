import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ApplyEntity } from '../../core/database/entities/apply.entity';

@Injectable()
export class ApplyRepository extends Repository<ApplyEntity> {}
