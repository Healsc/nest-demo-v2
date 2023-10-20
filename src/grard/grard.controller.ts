import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { JwtAuthGuard } from './jwt-auth.grard';
import { GrardService } from './grard.service';
import { CreateGrardDto } from './dto/create-grard.dto';
import { UpdateGrardDto } from './dto/update-grard.dto';
import { Public } from 'src/common/public.decorator';

@Controller('grard')
export class GrardController {
  constructor(private readonly grardService: GrardService) {}

  @Post()
  create(@Body() createGrardDto: CreateGrardDto) {
    return this.grardService.create(createGrardDto);
  }

  @Public()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.grardService.findAll();
  }

  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Get('findAllv2')
  findAllv2() {
    return this.grardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grardService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGrardDto: UpdateGrardDto) {
    return this.grardService.update(+id, updateGrardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grardService.remove(+id);
  }
}
