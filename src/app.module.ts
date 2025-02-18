import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { TeamModule } from './team/team.module';
import { IdeaModule } from './idea/idea.module';
import { LoggerMiddleware } from './core/middlewares/logger/logger.middleware';
import * as dotenv from 'dotenv';
import { DatabaseModule } from './core/infra/database.module';
import { AuthModule } from './auth/auth.module';
import { SystemSettingModule } from './system-setting/system-setting.module';

dotenv.config();
@Module({
  imports: [
    DatabaseModule,
    UserModule,
    TeamModule,
    IdeaModule,
    AuthModule,
    SystemSettingModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
