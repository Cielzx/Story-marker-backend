import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryRepository } from './repositories/category.repository';
import { v2 as cloud } from 'cloudinary';
import { UpdateCategoryDto } from './dto/category.update.dto';

@Injectable()
export class CategoryServices {
  constructor(private CategoryRepository: CategoryRepository) {}

  async create(data: CategoryDto) {
    const createCategory = await this.CategoryRepository.create(data);

    return createCategory;
  }

  async findAll() {
    const allCategories = await this.CategoryRepository.findAll();

    return allCategories;
  }

  async findOne(id: string) {
    const category = await this.CategoryRepository.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found!');
    }
    return category;
  }

  async findByName(name: string) {
    const category = await this.CategoryRepository.findByName(name);
    if (!name) {
      throw new NotFoundException('Category name not found');
    }

    return category;
  }

  async update(data: UpdateCategoryDto, id: string) {
    const updatedUser = await this.CategoryRepository.update(data, id);
    return updatedUser;
  }

  async upload(cover_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findCategory = await this.CategoryRepository.findOne(id);

    if (!findCategory) {
      throw new NotFoundException('Catgory not found!');
    }

    const imageUpload = await cloud.uploader.upload(
      cover_image.path,
      { resource_type: 'image' },
      (error, result) => {
        return result;
      },
    );

    const update = await this.CategoryRepository.update(
      {
        cover_image: imageUpload.secure_url,
      },
      id,
    );

    return update;
  }

  async remove(id: string) {
    await this.CategoryRepository.delete(id);

    return;
  }
}
