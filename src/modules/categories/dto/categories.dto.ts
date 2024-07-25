import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CategoriesDto {
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsOptional()
  @IsString()
  cover_image: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
