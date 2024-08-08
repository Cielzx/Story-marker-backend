import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FigureDto {
  @IsString()
  @IsOptional()
  figure_image: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}
