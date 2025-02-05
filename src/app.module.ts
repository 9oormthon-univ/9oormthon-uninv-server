import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { IdeaModule } from './idea/idea.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { ApplyModule } from './apply/apply.module';
import { MemberModule } from './member/member.module';
import { LegacyProjectMemberModule } from './legacy-project-member/legacy-project-member.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './database/database.module';
import { UnivModule } from './univ/univ.module';
import { RecruitModule } from './recruit/recruit.module';
import { AuthModule } from './auth/auth.module';

dotenv.config();
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TeamModule,
    IdeaModule,
    BookmarkModule,
    ApplyModule,
    MemberModule,
    LegacyProjectMemberModule,
    UnivModule,
    RecruitModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
