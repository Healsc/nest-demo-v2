import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { User } from '../user/entities/user.entity';
import { JWT_SECRET } from '../common/const';
import { JwtStrategy } from '../common/jwt-auth.strategy';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: JWT_SECRET,
          signOptions: {
            // expiresIn: '3d', //设置过期时间
          },
        };
      },
    }),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy],
})
export class AuthModule {}
