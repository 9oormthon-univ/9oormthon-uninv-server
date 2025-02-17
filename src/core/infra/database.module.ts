import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from './entities/user.entity';
import { MemberEntity } from './entities/member.entity';
import { IdeaEntity } from './entities/idea.entity';
import { IdeaSubjectEntity } from './entities/idea-subject.entity';
import { TeamEntity } from './entities/team.entity';
import { ProjectEntity } from './entities/project.entity';
import { LegacyProjectMemberEntity } from './entities/legacy-project-member.entity';
import { ApplyEntity } from './entities/apply.entity';
import { BookmarkEntity } from './entities/bookmark.entity';
import { UnivEntity } from './entities/univ.entity';
import { RecruitEntity } from './entities/recruit.entity';
import { SystemSettingEntity } from './entities/system-setting.entity';


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
        ApplyEntity,
        BookmarkEntity,
        IdeaEntity,
        IdeaSubjectEntity,
        LegacyProjectMemberEntity,
        MemberEntity,
        ProjectEntity,
        RecruitEntity,
        TeamEntity,
        UnivEntity,
        UserEntity,
        SystemSettingEntity
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      ApplyEntity,
      BookmarkEntity,
      IdeaEntity,
      IdeaSubjectEntity,
      LegacyProjectMemberEntity,
      MemberEntity,
      ProjectEntity,
      RecruitEntity,
      TeamEntity,
      UnivEntity,
      UserEntity,
      SystemSettingEntity
    ]),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
