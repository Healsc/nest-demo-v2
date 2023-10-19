import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';

import CeateUserInterface from './interface/create-user-interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

function md5(s: string) {
  return crypto.createHash('md5').update(s).digest('hex');
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
    const res = await this.userRepository.save(createUserDto);
    return res;
  }

  async resign(createUserDto: CeateUserInterface) {
    const { username, password } = createUserDto;
    const haveUserFlag = await this.userRepository.findOneBy({ username });
    if (haveUserFlag) {
      // throw new ForbiddenException('用户已存在');
      return {
        success: false,
        error: '用户已存在',
      };
    }
    const salt = genSaltSync(10);
    const hashPassword = hashSync(password, salt);
    const newUser = { ...createUserDto, password: hashPassword };
    const res = await this.userRepository.save(newUser);
    return res;
  }

  async login(createUserDto: CeateUserInterface) {
    const { username, password } = createUserDto;
    const currUser = await this.userRepository.findOneBy({ username });
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
    return currUser;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
