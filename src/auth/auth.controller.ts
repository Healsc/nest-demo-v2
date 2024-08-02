import { Controller, Post, Body, Query, Get, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UserService } from '../user/user.service';
import { Public } from 'src/common/jwt/public.decorator';

@Controller('api')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) { }

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

  @Public()
  @Get('login')
  async loginByGet(@Query() createUserDto: CreateAuthDto,
    @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(createUserDto);
    const { token } = result;
    const expiryDate = new Date(Date.now() + 100000); // 设置过期时间为当前时间往后 10 秒
    res.cookie('token', token, { expires: expiryDate, httpOnly: true });
    return result;
  }

  @Post('logout')
  logout(
    @Req() req: Request,
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) res: Response
  ) {
    // const { authorization } = headers;
    // const token = authorization.split(' ')[1];
    const token = req.cookies['token'];
    const result = this.authService.logout(token);
    res.cookie('token', token, { expires: new Date(Date.now() - 1), httpOnly: true });
    return result;
  }

  @Get('logout')
  logoutByGet(
    @Req() req: Request,
    @Headers() headers: Record<string, string>,
    @Res({ passthrough: true }) res: Response
  ) {
    // const { authorization } = headers;
    // const token = authorization.split(' ')[1];
    const token = req.cookies['token'];
    const result = this.authService.logout(token);
    res.cookie('token', token, { expires: new Date(Date.now() - 1), httpOnly: true });
    return result;
  }

  @Get('user')
  user(@Req() req: any,) {
    const { user } = req;
    const { username, id } = user;
    return {
      username,
      userId: id,
    };
  }
}
