import { Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { Member } from '../database/entities/member.entity';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { MemberRepository } from '../database/repositories/member.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Member, MemberRepository]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
})
export class MemberModule {}
