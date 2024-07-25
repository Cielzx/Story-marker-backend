// import { CategoryEntity } from '@prisma/client';
import { CategoryDto } from '../dto/category.dto';
import { UpdateCategoryDto } from '../dto/category.update.dto';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract create(data: CategoryDto): Promise<Category>;

  abstract findAll(): Promise<Category[]>;

  abstract findOne(id: string): Promise<Category> | Category;

  abstract findByName(category_name: string): Promise<Category>;

  abstract update(
    data: UpdateCategoryDto,
    id: string,
  ): Promise<Category> | Category;

  abstract delete(id: string): Promise<void>;
}
