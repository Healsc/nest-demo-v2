import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserGuard } from './user.guard';
import { JwtAuthGuard } from './jwt-auth.grard';
import { Public } from 'src/common/public.decorator';

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

  @Public()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Request() req) {
    const { user } = req;
    console.log({ user });
    /**
     * id: 6,
     * username: 'sc',
     * password: '$2b$10$gLLSUy/aDIOk85rRAbbe6eZFz2yjywaiQNPJSgFawxm.Jl3mGPCpy'
     */
    return this.userService.findAll();
  }
}
