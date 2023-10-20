import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import CeateUserInterface from './interface/create-user-interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

function md5(s: string) {
  return crypto.createHash('md5').update(s).digest('hex');
}

export interface UserInterface {
  id?: number;
  username: string;
  password: string;
}

export interface FindUserInterface {
  id?: number;
  username?: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  test(p: string) {
    const hash = md5(p);
    const salt = genSaltSync(10);
    const hash2 = hashSync(p, salt);
    const f = compareSync(p, hash2);
    const f2 = compareSync('p', hash2);
    return {
      p,
      hash,
      hash2,
      f,
      f2,
    };
  }
  async create(createUserDto: CeateUserInterface) {
    try {
      const res = await this.userRepository.save(createUserDto);
      return res;
    } catch {
      return null;
    }
  }

  async validateToken(t) {
    const tt = t.split(' ')[1];
    const res = this.jwtService.decode(tt);

    if (!res) return false;
    const exp = res['exp'];

    const expireFlag = dayjs().diff(dayjs.unix(exp)) > 0;
    if (expireFlag) return false;

    const user = await this.userRepository.findOneBy({
      username: res['username'],
    });
    if (!user) return false;
    return true;
  }

  async validate(username: string) {
    const user = this.userRepository.findOneBy({ username });
    return user;
  }

  async findAll() {
    try {
      const [data, count] = await this.userRepository.findAndCount();
      return {
        success: true,
        data,
        count,
      };
    } catch {
      throw new InternalServerErrorException('查询失败');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneBy(where: FindUserInterface) {
    if (!where) return null;
    const res = await this.userRepository.findOne({
      where,
    });
    return res;
  }
}
