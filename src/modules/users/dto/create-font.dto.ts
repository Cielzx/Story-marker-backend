import { IsDate, isString, IsString } from 'class-validator';

export class CreateFontDto {
  @IsString()
  name: string;

  @IsString()
  fileUrl: string;

  @IsString()
  format: string;
}
