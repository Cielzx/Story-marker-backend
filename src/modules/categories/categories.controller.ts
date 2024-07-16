import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CategoriesServices } from './categories.service';
import { CategoriesDto } from './dto/categories.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesServices) {}

  @Post('')
  create(@Body() data: CategoriesDto) {
    return this.categoriesService.create(data);
  }

  @Get('')
  findAll() {
    return this.categoriesService.findAll();
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
