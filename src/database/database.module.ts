import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { Team } from './entities/team.entity';
import { User } from './entities/user.entity';
import { UserIdeaApply } from './entities/user-idea-apply.entity';
import { UserIdeaDib } from './entities/user-idea-dib.entity';
import { UserTeam } from './entities/user-team.entity';
import * as dotenv from 'dotenv';
import { Univ } from './entities/univ.entity';
import { Recruit } from './entities/recruit.entity';
import { UserSemester } from './entities/user-semester';

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
        UserTeam,
        Idea,
        Team,
        Project,
        ProjectMember,
        UserIdeaApply,
        UserIdeaDib,
        Univ,
        Recruit,
        UserSemester,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Project,
      User,
      UserTeam,
      Idea,
      Team,
      ProjectMember,
      UserIdeaApply,
      UserIdeaDib,
      Univ,
      Recruit,
      UserSemester,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
