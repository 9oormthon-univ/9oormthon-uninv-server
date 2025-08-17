import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class CookieUtil {
  static getCookie(req: Request, name: string): string | null {
    const cookies = req.cookies;
    return cookies && cookies[name] ? cookies[name] : null;
  }

  static addCookie(res: Response, name: string, value: string): void {
    res.cookie(name, value, {
      path: '/',
      domain: process.env.CLIENT_URL,
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 일
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }

  static addSecureCookie(
    res: Response,
    name: string,
    value: string,
    maxAge: number,
  ): void {
    res.cookie(name, value, {
      path: '/',
      domain: process.env.CLIENT_URL,
      maxAge: maxAge * 1000,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }

  static deleteCookie(req: Request, res: Response, name: string): void {
    const cookies = req.cookies;

    if (!cookies || !cookies[name]) {
      return;
    }

    res.cookie(name, '', {
      path: '/',
      domain: process.env.CLIENT_URL,
      maxAge: 0,
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
    });
  }

  static refineCookie(req: Request, name: string): string | null {
    const cookies = req.cookies;

    return cookies && cookies[name] ? cookies[name] : null;
  }
}
