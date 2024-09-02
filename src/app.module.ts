import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { IdeasModule } from './ideas/ideas.module';
import { UsersIdeasDibsModule } from './users-ideas-dibs/users-ideas-dibs.module';
import { UsersIdeasApplysModule } from './users-ideas-applys/users-ideas-applys.module';
import { UsersTeamsModule } from './users-teams/users-teams.module';
import { ProjectMembersModule } from './project-members/project-members.module';
import { LoggerMiddleware } from './common/middlewares/logger/logger.middleware';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './database/database.module';
import { UnivModule } from './univ/univ.module';
import { RecruitsService } from './recruits/recruits.service';
import { RecruitsController } from './recruits/recruits.controller';
import { RecruitsModule } from './recruits/recruits.module';
import { Recruit } from './database/entities/recruit.entity';

dotenv.config();
@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    TeamsModule,
    IdeasModule,
    UsersIdeasDibsModule,
    UsersIdeasApplysModule,
    UsersTeamsModule,
    ProjectMembersModule,
    UnivModule,
    RecruitsModule,
  ],
  controllers: [AppController, RecruitsController],
  providers: [AppService, RecruitsService, Recruit],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
