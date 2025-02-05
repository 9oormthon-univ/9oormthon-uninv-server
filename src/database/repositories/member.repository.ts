import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';

@Injectable()
export class MemberRepository extends Repository<Member> {}
