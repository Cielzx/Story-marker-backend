import { CategoriesDto } from '../dto/categories.dto';
import { UpdateCategoriesDto } from '../dto/update.categories.dto';
import { CategoriesEntity } from '../entities/categories.entities';

export abstract class CategoriesRepository {
  abstract create(data: CategoriesDto): Promise<CategoriesEntity>;

  abstract findAll(): Promise<CategoriesEntity[]>;

  abstract findOne(id: string): Promise<CategoriesEntity>;

  abstract update(
    data: UpdateCategoriesDto,
    id: string,
  ): Promise<CategoriesEntity>;

  abstract delete(id: string): Promise<void> | void;
}
