import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserTeam } from '../entities/user-team.entity';

@Injectable()
export class UserTeamRepository extends Repository<UserTeam> {}
