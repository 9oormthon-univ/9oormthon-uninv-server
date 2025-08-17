import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { CookieUtil } from '../utils/cookie.util';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies;

    if (!token) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }

    return super.canActivate(context) as boolean;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    if (err || !user) {

      CookieUtil.deleteCookie(req, res, 'access_token');
      CookieUtil.deleteCookie(req, res, 'refresh_token');

      throw err || new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    return user;
  }
}
