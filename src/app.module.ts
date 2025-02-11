import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/application/modules/user.module';
import { TeamModule } from './team/application/modules/team.module';
import { IdeaModule } from './idea/application/modules/idea.module';
import { LoggerMiddleware } from './core/middlewares/logger/logger.middleware';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './core/database/database.module';
import { AuthModule } from './auth/auth.module';

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
