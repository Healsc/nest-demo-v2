import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { JWT_SECRET } from './const';
import { UserService } from '../user/user.service';
import { RedisService } from 'src/redis/redis.service';

export interface JwtPayload {
  username: string;
  iat: number;
  exp: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    const { username } = payload;
    const user = this.userService.validate(username);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - 0');
    }
    // 黑名单方式开始
    let keys = [];
    try {
      keys = await this.redisService.keys(token);
    } catch {
      keys = [];
    }
    if (keys.length) {
      throw new UnauthorizedException('Unauthorized - 1');
    }
    // 黑名单方式结束

    return user;
  }
}
