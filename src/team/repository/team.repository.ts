import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TeamEntity } from '../../core/infra/entities/team.entity';

@Injectable()
export class TeamRepository extends Repository<TeamEntity> {}
