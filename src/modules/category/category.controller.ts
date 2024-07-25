import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryServices } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { JwtAuth } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/adm-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UpdateCategoryDto } from './dto/category.update.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryServices: CategoryServices) {}

  @Post('')
  @UseGuards(JwtAuth, AdminGuard)
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

  @Get(':name')
  @UseGuards(JwtAuth)
  findByName(@Param('name') name: string) {
    return this.categoryServices.findByName(name);
  }

  @Patch('update/:id')
  @UseGuards(JwtAuth)
  update(@Body() data: UpdateCategoryDto, @Param('id') id: string) {
    return this.categoryServices.update(data, id);
  }

  @Patch('upload/:id')
  @UseGuards(JwtAuth, AdminGuard)
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
    return this.categoryServices.upload(cover_image[0], id);
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuth, AdminGuard)
  remove(@Param('id') id: string) {
    return this.categoryServices.remove(id);
  }
}
