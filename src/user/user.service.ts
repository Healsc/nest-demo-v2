import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

import CeateUserInterface from './interface/create-user-interface';
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
