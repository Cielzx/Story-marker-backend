import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class FigureDto {
  @IsString()
  @IsOptional()
  figure_image: string;

  @IsString()
  @IsNotEmpty()
  subCategoryId: string;
}

export class UserStickerDto {
  @IsString()
  @IsOptional()
  figure_image: string;

  @IsString()
  @IsOptional()
  subCategoryId: string;
}
