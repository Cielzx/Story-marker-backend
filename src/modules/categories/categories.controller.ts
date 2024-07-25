import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoriesServices } from './categories.service';
import { CategoriesDto } from './dto/categories.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateCategoriesDto } from './dto/update.categories.dto';

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuth)
  update(@Body() data: UpdateCategoriesDto, @Param('id') id: string) {
    return this.categoriesService.update(data, id);
  }

  @Patch('upload/:id')
  // @UseGuards(JwtAuth, AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'cover_image', maxCount: 1 }]),
  )
  upload(
    @UploadedFiles()
    files: {
      cover_image?: Express.Multer.File[];
    },
    @Param('id') id: string,
  ) {
    const { cover_image } = files;
    return this.categoriesService.upload(cover_image[0], id);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
