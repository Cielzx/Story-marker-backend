import { Injectable } from '@nestjs/common';
import { CategoriesDto } from './dto/categories.dto';
import { CategoriesRepository } from './repositories/categories.repository';

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

  async remove(id: string) {
    await this.categoriesRepository.delete(id);
    return;
  }
}
