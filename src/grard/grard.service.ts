import { Injectable } from '@nestjs/common';
import { CreateGrardDto } from './dto/create-grard.dto';
import { UpdateGrardDto } from './dto/update-grard.dto';

@Injectable()
export class GrardService {
  create(createGrardDto: CreateGrardDto) {
    return 'This action adds a new grard';
  }

  findAll() {
    return `This action returns all grard`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grard`;
  }

  update(id: number, updateGrardDto: UpdateGrardDto) {
    return `This action updates a #${id} grard`;
  }

  remove(id: number) {
    return `This action removes a #${id} grard`;
  }
}
