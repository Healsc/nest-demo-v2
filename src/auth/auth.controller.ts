import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { Public } from 'src/common/public.decorator';

@Controller('api')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('resign')
  resign(@Body() createUserDto: CreateAuthDto) {
    return this.authService.resign(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() createUserDto: CreateAuthDto) {
    return this.authService.login(createUserDto);
  }

  @Post('logout')
  logout() {
    return true;
  }

  @Get('user')
  user(@Request() req) {
    const { user } = req;
    const { username, id } = user;
    return {
      username,
      userId: id,
    };
  }
}
