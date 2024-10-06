import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserIdeaApply } from '../entities/user-idea-apply.entity';

@Injectable()
export class UserIdeaApplyRepository extends Repository<UserIdeaApply> {}
