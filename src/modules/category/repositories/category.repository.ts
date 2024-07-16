// import { CategoryEntity } from '@prisma/client';
import { CategoryDto } from '../dto/category.dto';
import { Category } from '../entities/category.entity';

export abstract class CategoryRepository {
  abstract create(data: CategoryDto): Promise<Category>;

  abstract findAll(): Promise<Category[]>;

  abstract findOne(id: string): Promise<Category> | undefined;

  abstract delete(id: string): Promise<void>;
}
