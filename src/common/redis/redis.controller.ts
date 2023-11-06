import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
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

  @Get('set')
  set(
    @Query('key') key: string,
    @Query('value') value: string,
    @Query('second', ParseIntPipe)
    second: number,
  ) {
    return this.redisService.set(key, value, second);
  }
}
