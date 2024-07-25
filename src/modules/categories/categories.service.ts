import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesDto } from './dto/categories.dto';
import { CategoriesRepository } from './repositories/categories.repository';
import { v2 as cloud } from 'cloudinary';
import { UpdateCategoriesDto } from './dto/update.categories.dto';

@Injectable()
export class CategoriesServices {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async create(data: CategoriesDto) {
    const categorie = await this.categoriesRepository.create(data);

    return categorie;
  }

  async findAll() {
    const categories = await this.categoriesRepository.findAll();

    return categories;
  }

  async findOne(id: string) {
    const categorie = await this.categoriesRepository.findOne(id);

    return categorie;
  }

  async update(data: UpdateCategoriesDto, id: string) {
    const updatedUser = await this.categoriesRepository.update(data, id);
    return updatedUser;
  }

  async upload(cover_image: Express.Multer.File, id: string) {
    cloud.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });

    const findCategory = await this.categoriesRepository.findOne(id);

    if (!findCategory) {
      throw new NotFoundException('Sub-Categorie not found!');
    }

    const imageUpload = await cloud.uploader.upload(
      cover_image.path,
      { resource_type: 'image' },
      (error, result) => {
        return result;
      },
    );

    const update = await this.categoriesRepository.update(
      {
        cover_image: imageUpload.secure_url,
      },
      id,
    );

    return update;
  }
  async remove(id: string) {
    await this.categoriesRepository.delete(id);
    return;
  }
}
