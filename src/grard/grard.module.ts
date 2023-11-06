import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './const';
import { GrardService } from './grard.service';
import { GrardController } from './grard.controller';
import { JwtStrategy } from '../common/jwt/jwt-auth.strategy';
import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: JWT_SECRET,
          signOptions: {
            expiresIn: '3d', //设置过期时间
          },
        };
      },
    }),
    RedisModule,
  ],
  controllers: [GrardController],
  providers: [GrardService, JwtStrategy, UserService],
})
export class GrardModule {}
