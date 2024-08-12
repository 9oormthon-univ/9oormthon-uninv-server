import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersTeam } from '../entities/users-team.entity';

@Injectable()
export class UsersTeamRepository extends Repository<UsersTeam> {}
