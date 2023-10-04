import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBookRequestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;
}