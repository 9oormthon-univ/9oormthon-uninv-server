import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { JwtStrategy } from '../core/strategies/jwt.strategy';
import { JwtAuthGuard } from '../core/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { DataSource } from 'typeorm';
import { UserRepository } from '../user/repository/user.repository';
import { LoginService } from './application/service/login.service';
import { LogoutService } from './application/service/logout.service';
import { ReadAuthBriefService } from './application/service/read-auth-brief.service';
import { ReissueJwtService } from './application/service/reissue-jwt.service';
import { SignUpService } from './application/service/sign-up.service';
import { SignUpAdminService } from './application/service/sign-up-admin.service';
import { ChangePasswordService } from './application/service/change-password.service';
import { IdeaModule } from '../idea/idea.module';

@Module({
  imports: [
    UserModule,
    IdeaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    LoginService,
    LogoutService,
    ReadAuthBriefService,
    ReissueJwtService,
    SignUpService,
    SignUpAdminService,
    ChangePasswordService,
    JwtStrategy,
    JwtAuthGuard,
    UserRepository
  ],
  controllers: [AuthController],
})
export class AuthModule {
  constructor(private dataSource: DataSource) {}
}
