import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Apply } from '../entities/apply.entity';

@Injectable()
export class ApplyRepository extends Repository<Apply> {}
