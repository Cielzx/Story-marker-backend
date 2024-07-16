import { IsNotEmpty, IsString } from 'class-validator';

export class FavoritesDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  stickerId: string;
}
