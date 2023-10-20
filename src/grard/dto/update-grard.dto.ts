import { PartialType } from '@nestjs/mapped-types';
import { CreateGrardDto } from './create-grard.dto';

export class UpdateGrardDto extends PartialType(CreateGrardDto) {}
