import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { JwtStrategy } from '../../../core/strategies/jwt.strategy';
import { JwtAuthGuard } from '../../../core/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../../../user/application/module/user.module';
import { DataSource } from 'typeorm';
import { UserRepositoryImpl } from '../../../user/repository/user.repository.impl';
import { LoginService } from '../service/login.service';
import { LogoutService } from '../service/logout.service';
import { ReadAuthBriefService } from '../service/read-auth-brief.service';
import { ReissueJwtService } from '../service/reissue-jwt.service';
import { SignUpService } from '../service/sign-up.service';
import { SignUpAdminService } from '../service/sign-up-admin.service';
import { ChangePasswordService } from '../service/change-password.service';

@Module({
  imports: [
    UserModule,
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
    UserRepositoryImpl
  ],
  controllers: [AuthController],
})
export class AuthModule {
  constructor(private dataSource: DataSource) {}
}
