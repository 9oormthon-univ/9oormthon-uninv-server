import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { IdeaModule } from './idea/idea.module';
import { UserIdeaDibModule } from './user-idea-dib/user-idea-dib.module';
import { UserIdeaApplyModule } from './user-idea-apply/user-idea-apply.module';
import { UserTeamModule } from './user-team/user-team.module';
import { ProjectMemberModule } from './project-member/project-member.module';
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
    UserIdeaDibModule,
    UserIdeaApplyModule,
    UserTeamModule,
    ProjectMemberModule,
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
