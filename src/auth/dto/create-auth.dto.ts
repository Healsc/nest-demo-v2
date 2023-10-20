import {
  IsString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';
export class CreateAuthDto {
  @IsOptional()
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 32)
  password: string;
}
