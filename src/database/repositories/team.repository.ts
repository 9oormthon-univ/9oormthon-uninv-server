import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';

@Injectable()
export class TeamRepository extends Repository<Team> {}
