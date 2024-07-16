import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FigureDto {
  @IsString()
  @IsNotEmpty()
  figure_name: string;

  @IsString()
  @IsOptional()
  figure_image: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}
