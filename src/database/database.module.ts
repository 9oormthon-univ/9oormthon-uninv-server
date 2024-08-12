import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';;
import { Idea } from './entities/idea.entity';
import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { Team } from './entities/team.entity';
import { User } from './entities/user.entity';
import { UsersIdeasApply } from './entities/users-ideas-apply.entity';
import { UsersIdeasDib } from './entities/users-ideas-dib.entity';
import { UsersTeam } from './entities/users-team.entity';
import * as dotenv from 'dotenv';

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
      entities: [
        User,
        UsersTeam,
        Idea,
        Team,
        Project,
        ProjectMember,
        UsersIdeasApply,
        UsersIdeasDib,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Project,
      User,
      UsersTeam,
      Idea,
      Team,
      ProjectMember,
      UsersIdeasApply,
      UsersIdeasDib,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
