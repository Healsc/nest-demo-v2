import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      // // 详细的错误消息不会显示在响应正文中
      disableErrorMessages: false,
      // 不是定义中的字段将会被删除
      whitelist: true,
      // 有不是定义中的字段将会校验不通过
      // forbidNonWhitelisted: true,
      // // 执行基本类型的转换，没有必要，可以做显式转换
      // transform: true,
    }),
  );
  app.use(
    session({
      secret: 'session_secret', // 加密
      rolling: true, // 每次请求添加cookie
      name: 'session_id', // 存在浏览器cookie中的key
      resave: false, // 每次请求都重新设置
      saveUninitialized: true, // 未初始化的是否返回session
      cookie: {
        maxAge: 1000 * 60 * 60, // ms
      },
    }),
  );
  await app.listen(3003);
}
bootstrap();
