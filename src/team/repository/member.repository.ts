import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MemberEntity } from '../../core/infra/entities/member.entity';

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {}
