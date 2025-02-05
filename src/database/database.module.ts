import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { Project } from './entities/project.entity';
import { LegacyProjectMember } from './entities/legacy-project-member.entity';
import { Team } from './entities/team.entity';
import { User } from './entities/user.entity';
import { Apply } from './entities/apply.entity';
import { Bookmark } from './entities/bookmark.entity';
import { Member } from './entities/member.entity';
import * as dotenv from 'dotenv';
import { Univ } from './entities/univ.entity';
import { Recruit } from './entities/recruit.entity';
import { IdeaSubject } from './entities/idea-subject.entity';

dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      timezone: 'Z',
      entities: [
        User,
        Member,
        Idea,
        IdeaSubject,
        Team,
        Project,
        LegacyProjectMember,
        Apply,
        Bookmark,
        Univ,
        Recruit,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Project,
      User,
      Member,
      Idea,
      IdeaSubject,
      Team,
      LegacyProjectMember,
      Apply,
      Bookmark,
      Univ,
      Recruit,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
