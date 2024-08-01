import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import type { Request } from 'express';

import { JWT_SECRET } from '../const';
import { UserService } from '../../user/user.service';
import { RedisService } from 'src/common/redis/redis.service';

export interface JwtPayload {
  username: string;
  iat: number;
  exp: string;
}

/**
 * 自定义从Authorization cookies中获取token
 * 需要使用cookies-parser中间件
 * https://static.kancloud.cn/juukee/nestjs/2676781
 * 默认是从Authorization头读取JWT的配置，其方案为“bearer”
 * https://www.npmjs.com/package/passport-jwt
 * @param {Request} req 
 * @returns {string | null}
 */
var cookieExtractor = (req: Request): string | null => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 默认
      jwtFromRequest: cookieExtractor, // 自定义
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req); // 默认
    const token = cookieExtractor(req); // 自定义
    const { username } = payload;
    const user = await this.userService.validate(username);
    if (!user) {
      throw new UnauthorizedException('Unauthorized - token验证失败');
    }
    const { id } = user;
    const cacheToken = await this.redisService.get(`token_${id}`);
    if (!cacheToken) {
      throw new UnauthorizedException('Unauthorized - token已过期');
    }
    if (token !== cacheToken) {
      throw new UnauthorizedException('Unauthorized - token不正确');
    }
    await this.redisService.set(`token_${id}`, token, 10 * 60);
    // 黑名单方式开始
    // let keys = [];
    // try {
    //   keys = await this.redisService.keys(token);
    // } catch {
    //   keys = [];
    // }
    // if (keys.length) {
    //   throw new UnauthorizedException('Unauthorized - 1');
    // }
    // 黑名单方式结束

    return user;
  }
}
