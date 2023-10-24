import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redisService: RedisService) {}

  @Get()
  getHello() {
    return this.redisService.getHello();
  }

  @Get('get')
  get(@Query('key') key: string) {
    return this.redisService.get(key);
  }
}
