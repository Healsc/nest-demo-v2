import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class TestService {
  constructor(private readonly redisService: RedisService) {}

  redistest() {
    const value = this.redisService.getHello();
    return value;
  }
}
