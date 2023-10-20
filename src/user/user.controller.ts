import { Controller, Get, Post, Body, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('api/user/test')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('test')
  test(@Query('p') p: string) {
    return this.userService.test(p);
  }
}
