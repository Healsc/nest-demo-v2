import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { SessionModule } from './session/session.module';
import { JwtAuthGuard } from './common/jwt-auth.grard';
import { AuthModule } from './auth/auth.module';
import { GrardModule } from './grard/grard.module';
import { RedisModule } from './redis/redis.module';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // 数据库类型
      host: '127.0.0.1', // 数据库主机名
      port: 3306, // 数据库端口
      username: 'sunchuang', // 数据库用户名
      password: '123456', // 数据库密码
      database: 'mydb', // 数据库名
      entities: [User],
      synchronize: true, // 是否自动同步数据库结构，慎用
    }),
    UserModule,
    SessionModule,
    AuthModule,
    GrardModule,
    RedisModule,
    TestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
