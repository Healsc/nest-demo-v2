import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  controllers: [TestController],
  providers: [TestService],
  imports: [RedisModule],
})
export class TestModule {}
