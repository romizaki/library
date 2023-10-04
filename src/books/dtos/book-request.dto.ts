import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class BookRequestDto {
  @IsNotEmpty()
  @Transform((value) => Number(value))
  limit: number;

  @IsNotEmpty()
  @Transform((value) => Number(value))
  page: number;

  @IsOptional()
  @IsString()
  search: string;
}