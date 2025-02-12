import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/application/module/user.module';
import { TeamModule } from './team/application/module/team.module';
import { IdeaModule } from './idea/application/module/idea.module';
import { LoggerMiddleware } from './core/middlewares/logger/logger.middleware';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './auth/application/module/auth.module';

dotenv.config();
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TeamModule,
    IdeaModule,
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
