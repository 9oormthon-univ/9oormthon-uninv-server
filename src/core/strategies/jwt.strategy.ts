import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response } from 'express';
import { JwtConstant } from '../constants/jwt-constant';
import { CommonException } from '../exceptions/common.exception';
import { ErrorCode } from '../exceptions/error-code';
import { CookieUtil } from '../utils/cookie.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          if (req && req.cookies) {
            return req.cookies['access_token'];
          }
          return null;
        },
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(req: Request, payload: any) {
    if (!payload) {
      const res = (req as any).res as Response | undefined;
      CookieUtil.deleteCookie(req, res, 'access_token');
      CookieUtil.deleteCookie(req, res, 'refresh_token');
      throw new UnauthorizedException('Invalid token');
    }

    if (payload.tokenType !== JwtConstant.ACCESS_TOKEN) {
      const res = (req as any).res as Response | undefined;
      CookieUtil.deleteCookie(req, res, 'access_token');
      CookieUtil.deleteCookie(req, res, 'refresh_token');
      throw new CommonException(ErrorCode.TOKEN_TYPE_ERROR);
    }
    return { id: payload.userId, role: payload.role, tokenType: payload.tokenType };
  }
}
