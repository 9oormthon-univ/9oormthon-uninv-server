import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UsersIdeasApply } from '../entities/users-ideas-apply.entity';

@Injectable()
export class UsersIdeasApplyRepository extends Repository<UsersIdeasApply> {}
