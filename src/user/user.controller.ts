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

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('resign')
  resign(@Body() createUserDto: CreateUserDto) {
    return this.userService.resign(createUserDto);
  }

  @Public()
  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }

  @Get('test')
  test(@Query('p') p: string) {
    return this.userService.test(p);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
