import { Module } from '@nestjs/common';
import { LegacyProjectMemberService } from './legacy-project-member.service';
import { LegacyProjectMemberController } from './legacy-project-member.controller';
import { LegacyProjectMember } from '../database/entities/legacy-project-member.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../database/database.module';
import { LegacyProjectMemberRepository } from '../database/repositories/legacy-project-member.repository';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      LegacyProjectMember,
      LegacyProjectMemberRepository,
    ]),
  ],
  providers: [LegacyProjectMemberService],
  controllers: [LegacyProjectMemberController],
})
export class LegacyProjectMemberModule {}
