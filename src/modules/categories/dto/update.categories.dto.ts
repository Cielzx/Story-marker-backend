import { PartialType } from '@nestjs/mapped-types';
import { CategoriesDto } from './categories.dto';

export class UpdateCategoriesDto extends PartialType(CategoriesDto) {}
