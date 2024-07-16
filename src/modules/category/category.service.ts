import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryRepository } from './repositories/category.repository';

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

  async remove(id: string) {
    await this.CategoryRepository.delete(id);

    return;
  }
}
