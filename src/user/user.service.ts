import {
  Injectable,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import CeateUserInterface from './interface/create-user-interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CeateUserInterface) {
    const res = await this.userRepository.save(createUserDto);
    return res;
  }

  async resign(createUserDto: CeateUserInterface) {
    const { username } = createUserDto;
    const haveUserFlag = await this.userRepository.findOneBy({ username });
    if (haveUserFlag) {
      // throw new ForbiddenException('用户已存在');
      return {
        success: false,
        error: '用户已存在',
      };
    }
    const res = await this.userRepository.save(createUserDto);
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
    const p = password === currUser.password;
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
