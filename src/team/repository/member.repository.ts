import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MemberEntity } from '../../core/database/entities/member.entity';

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {}
