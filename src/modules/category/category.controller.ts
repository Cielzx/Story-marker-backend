import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryServices } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryServices: CategoryServices) {}

  @Post('')
  @UseGuards(JwtAuth)
  create(@Body() data: CategoryDto) {
    return this.categoryServices.create(data);
  }

  @Get('')
  findAll() {
    return this.categoryServices.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuth)
  findOne(@Param('id') id: string) {
    return this.categoryServices.findOne(id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param() id: string) {
    return this.categoryServices.remove(id);
  }
}
