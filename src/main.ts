import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: 'session_secret', // 加密
      rolling: true, // 每次请求添加cookie
      name: 'session_id', // 存在浏览器cookie中的key
      resave: false, // 每次请求都重新设置
      saveUninitialized: true, // 未初始化的是否返回session
      cookie: {
        maxAge: 1000 * 10, // ms
      },
    }),
  );
  await app.listen(3003);
}
bootstrap();
