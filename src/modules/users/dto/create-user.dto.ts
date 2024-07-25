import { hashSync } from 'bcryptjs';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => hashSync(value, 10), {
    groups: ['transform'],
  })
  password: string;

  @IsString()
  @IsOptional()
  passwordResetToken: string;

  @IsDate()
  @IsOptional()
  passwordResetExpires: Date;

  @IsString()
  @IsOptional()
  profile_image: string;

  @IsBoolean()
  @IsOptional()
  is_admin: boolean;
}
