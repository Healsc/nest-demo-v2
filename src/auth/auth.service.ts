import { Injectable } from '@nestjs/common';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';

import { CeateUserInterface } from './interface/user';
import { UserService } from 'src/user/user.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}
  async resign(user: CeateUserInterface) {
    const { username, password } = user;
    const haveuser = await this.userService.findOneBy({ username });
    if (haveuser) {
      return {
        success: false,
        error: 'username已存在',
      };
    }
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    const newUser = { ...user, password: hashPassword };
    const res = await this.userService.create(newUser);
    return res;
  }

  async login(createUserDto: CeateUserInterface) {
    const { username, password } = createUserDto;
    const currUser = await this.userService.findOneBy({ username });
    if (!currUser) {
      return {
        error: '用户不存在或密码错误',
      };
    }
    const p = compareSync(password, currUser.password);
    if (!p) {
      return {
        error: '用户不存在或密码错误',
      };
    }
    const jwt = this.jwtService.sign({
      username,
    });
    const { id } = currUser;
    this.redisService.set(`token_${id}`, jwt, 10 * 60);
    return {
      success: true,
      token: jwt,
      username,
    };
  }

  async logout(token: string) {
    const de = this.jwtService.verify(token);
    const { exp } = de;
    const second = dayjs.unix(exp).diff(dayjs(), 'seconds');
    if (second > 0) {
      try {
        await this.redisService.set(token, '', second);
      } catch {}
    }
    return {
      success: true,
      message: '退出成功',
    };
  }
}
